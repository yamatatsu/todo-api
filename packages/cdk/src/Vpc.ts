import { App, Stack, StackProps, aws_ec2 as ec2 } from "aws-cdk-lib";

export class VpcStack extends Stack {
  public readonly vpc: ec2.IVpc;

  constructor(parent: App, id: string, props?: StackProps) {
    super(parent, id, props);

    const vpc = new ec2.Vpc(this, "Vpc", {
      natGatewayProvider: ec2.NatInstanceProvider.instance({
        instanceType: new ec2.InstanceType("t2.nano"),
      }),
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "ingress",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "application",
          subnetType: ec2.SubnetType.PRIVATE,
        },
        {
          cidrMask: 28,
          name: "rds",
          subnetType: ec2.SubnetType.ISOLATED,
        },
      ],
    });

    this.vpc = vpc;
  }
}
