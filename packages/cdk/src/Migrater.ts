import {
  App,
  Stack,
  StackProps,
  aws_ec2,
  aws_lambda,
  aws_secretsmanager,
  Duration,
} from "aws-cdk-lib";

type Props = StackProps & {
  dockerfilePath: string;
  vpc: aws_ec2.IVpc;
  securityGroup: aws_ec2.ISecurityGroup;
  dbCredentialSecret: aws_secretsmanager.ISecret;
  proxyEndpoint: string;
};

/**
 * Database に対して prisma migrate deploy をかけるための lambda 関数を定義する。
 * application subnet 内で実行されることで、databaseへアクセス可能となる。
 */
export class MigraterStack extends Stack {
  constructor(parent: App, id: string, props: Props) {
    super(parent, id, props);

    const handler = new aws_lambda.DockerImageFunction(this, "Lambda", {
      functionName: `${id}-Fn`,
      code: aws_lambda.DockerImageCode.fromImageAsset(props.dockerfilePath),
      // 途中で実行止まると怖いので5分くらいを設定する
      timeout: Duration.minutes(5),
      vpc: props.vpc,
      vpcSubnets: { subnetGroupName: "application" },
      securityGroups: [props.securityGroup],
      environment: {
        SECRET_NAME: props.dbCredentialSecret.secretName,
        DATABASE_ENDPOINT: props.proxyEndpoint,
      },
    });

    props.dbCredentialSecret.grantRead(handler);
  }
}
