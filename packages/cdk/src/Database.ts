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
  securityGroup: aws_ec2.ISecurityGroup;
};

export class DatabaseStack extends Stack {
  public readonly dbCredentialSecret: aws_secretsmanager.ISecret;

  constructor(parent: App, id: string, props: Props) {
    super(parent, id, props);

    const dbCluster = new aws_rds.ServerlessCluster(this, "Aurora", {
      engine: aws_rds.DatabaseClusterEngine.AURORA,
      credentials: aws_rds.Credentials.fromGeneratedSecret("LambdaRdsProxy"),
      defaultDatabaseName: "tadb",
      vpc: props.vpc,
      vpcSubnets: { subnetType: aws_ec2.SubnetType.ISOLATED },
      securityGroups: [props.securityGroup],
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // production codeではないので、カジュアルに`!`使う
    this.dbCredentialSecret = dbCluster.secret!;
  }
}
