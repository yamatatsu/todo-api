import { App, Stack, StackProps, aws_ec2 } from "aws-cdk-lib";

export class VpcStack extends Stack {
  public readonly vpc: aws_ec2.IVpc;

  constructor(parent: App, id: string, props?: StackProps) {
    super(parent, id, props);

    const vpc = new aws_ec2.Vpc(this, "Vpc", {
      natGateways: 0,
      maxAzs: 2,
      // natGatewayProvider: aws_ec2.NatInstanceProvider.instance({
      //   instanceType: new aws_ec2.InstanceType("t2.nano"),
      // }),
      subnetConfiguration: [
        // {
        //   cidrMask: 24,
        //   name: "ingress",
        //   subnetType: aws_ec2.SubnetType.PUBLIC,
        // },
        {
          cidrMask: 24,
          name: "application",
          subnetType: aws_ec2.SubnetType.ISOLATED,
        },
        {
          cidrMask: 28,
          name: "rds",
          subnetType: aws_ec2.SubnetType.ISOLATED,
        },
      ],
    });

    new aws_ec2.InterfaceVpcEndpoint(this, "SecretManagerVpcEndpoint", {
      vpc: vpc,
      service: aws_ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
    });

    this.vpc = vpc;
  }
}
