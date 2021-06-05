import {
  App,
  Stack,
  StackProps,
  RemovalPolicy,
  aws_ec2 as ec2,
  aws_rds as rds,
  aws_secretsmanager,
} from "aws-cdk-lib";

type Props = StackProps & {
  vpc: ec2.IVpc;
};

export class DatabaseStack extends Stack {
  public readonly dbHost: string;
  public readonly dbPort: string;
  public readonly dbCredentialSecretName: string;

  constructor(parent: App, id: string, props: Props) {
    super(parent, id, props);

    const dbCluster = new rds.ServerlessCluster(this, "Aurora", {
      engine: rds.DatabaseClusterEngine.AURORA,
      credentials: rds.Credentials.fromGeneratedSecret("LambdaRdsProxy"),
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.ISOLATED },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.dbHost = dbCluster.clusterEndpoint.hostname;
    this.dbPort = dbCluster.clusterEndpoint.port.toString();
    this.dbCredentialSecretName = dbCluster.secret!.secretName;
  }
}
