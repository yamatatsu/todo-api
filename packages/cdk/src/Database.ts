import {
  App,
  Stack,
  StackProps,
  RemovalPolicy,
  aws_ec2,
  aws_rds,
  aws_secretsmanager,
} from "aws-cdk-lib";

type Props = StackProps & {
  vpc: aws_ec2.IVpc;
};

export class DatabaseStack extends Stack {
  public readonly dbCluster: aws_rds.IServerlessCluster;
  public readonly dbCredentialSecret: aws_secretsmanager.ISecret;

  constructor(parent: App, id: string, props: Props) {
    super(parent, id, props);

    const dbCluster = new aws_rds.ServerlessCluster(this, "ServerlessCluster", {
      engine: aws_rds.DatabaseClusterEngine.AURORA_MYSQL,
      credentials: aws_rds.Credentials.fromGeneratedSecret("dbAdmin"),
      defaultDatabaseName: "tadb",
      enableDataApi: true,
      vpc: props.vpc,
      vpcSubnets: { subnetGroupName: "rds" },
      // securityGroups: [dbSG],
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const dbCredentialSecret = dbCluster.secret!;

    this.dbCredentialSecret = dbCredentialSecret;
    this.dbCluster = dbCluster;
  }
}
