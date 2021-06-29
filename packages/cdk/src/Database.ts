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
  // securityGroup: aws_ec2.ISecurityGroup;
};

export class DatabaseStack extends Stack {
  public readonly dbAccessSG: aws_ec2.ISecurityGroup;
  // public readonly dbSG: aws_ec2.ISecurityGroup;
  public readonly dbCredentialSecret: aws_secretsmanager.ISecret;
  public readonly proxy: aws_rds.IDatabaseProxy;

  constructor(parent: App, id: string, props: Props) {
    super(parent, id, props);

    /**
     * DB接続に関するSecurityGroupはここで作成する。
     * VPCと一緒に作成すると循環参照になる。
     * Respect for https://github.com/aws/aws-cdk/issues/13169
     */
    const dbAccessSG = new aws_ec2.SecurityGroup(this, "DBAccessSG", {
      vpc: props.vpc,
      description: "for accessing database",
      securityGroupName: "Database Access",
    });
    const dbSG = new aws_ec2.SecurityGroup(this, "DBSG", {
      vpc: props.vpc,
      description: "for database",
      securityGroupName: "Database",
      allowAllOutbound: false,
    });
    dbSG.addIngressRule(
      dbAccessSG,
      aws_ec2.Port.tcp(3306),
      `from application with sg named ${dbAccessSG.securityGroupName}`
    );

    const dbCluster = new aws_rds.DatabaseCluster(this, "Aurora", {
      engine: aws_rds.DatabaseClusterEngine.AURORA,
      credentials: aws_rds.Credentials.fromGeneratedSecret("dbAdmin"),
      defaultDatabaseName: "tadb",
      instanceProps: {
        vpc: props.vpc,
        vpcSubnets: { subnetGroupName: "rds" },
        securityGroups: [dbSG],
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // production codeではないので、カジュアルに`!`使う
    const dbCredentialSecret = dbCluster.secret!;

    const proxy = dbCluster.addProxy("RdsProxy", {
      vpc: props.vpc,
      secrets: [dbCredentialSecret],
      securityGroups: [dbSG],
      requireTLS: false,
    });

    this.dbAccessSG = dbAccessSG;
    this.dbCredentialSecret = dbCredentialSecret;
    this.proxy = proxy;
  }
}
