import { App, Stack, StackProps, aws_ec2, aws_iam } from "aws-cdk-lib";

type BastionProps = {
  vpc: aws_ec2.IVpc;
  securityGroup: aws_ec2.ISecurityGroup;
} & StackProps;

export class BastionStack extends Stack {
  readonly bastion: aws_ec2.Instance;

  constructor(scope: App, id: string, props: BastionProps) {
    super(scope, id, props);

    const instanceType = new aws_ec2.InstanceType("t2.micro");
    const machineImage = new aws_ec2.AmazonLinuxImage({
      generation: aws_ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
    });

    // ec2 instance for bastion server.
    this.bastion = new aws_ec2.Instance(this, "Bastion", {
      instanceType: instanceType,
      machineImage: machineImage,
      vpc: props.vpc,
      vpcSubnets: { subnetGroupName: "application" },
    });

    this.bastion.addSecurityGroup(props.securityGroup);

    // for ssm session manager
    this.bastion.addToRolePolicy(
      new aws_iam.PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        actions: [
          "ssm:UpdateInstanceInformation",
          "ssmmessages:CreateControlChannel",
          "ssmmessages:CreateDataChannel",
          "ssmmessages:OpenControlChannel",
          "ssmmessages:OpenDataChannel",
        ],
        resources: ["*"],
      })
    );

    this.bastion.addToRolePolicy(
      new aws_iam.PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        actions: ["s3:GetEncryptionConfiguration"],
        resources: ["*"],
      })
    );
  }
}
