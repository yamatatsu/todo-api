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
  cluster: aws_rds.IDatabaseCluster;
  secret: aws_secretsmanager.ISecret;
};

export class DatabaseProxyStack extends Stack {
  public readonly proxy: aws_rds.IDatabaseProxy;

  constructor(parent: App, id: string, props: Props) {
    super(parent, id, props);

    const proxy = props.cluster.addProxy("RdsProxy", {
      vpc: props.vpc,
      secrets: [props.secret],
      securityGroups: [props.securityGroup],
    });
    // proxy.connections.allowFromAnyIpv4(aws_ec2.Port.tcp(3306));

    this.proxy = proxy;
  }
}
