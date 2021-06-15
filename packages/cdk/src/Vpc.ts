import { App, Stack, StackProps, aws_ec2 } from "aws-cdk-lib";

export class VpcStack extends Stack {
  public readonly vpc: aws_ec2.IVpc;
  // public readonly dbAccessSG: aws_ec2.ISecurityGroup;
  // public readonly dbSG: aws_ec2.ISecurityGroup;

  constructor(parent: App, id: string, props?: StackProps) {
    super(parent, id, props);

    const vpc = new aws_ec2.Vpc(this, "Vpc", {
      natGatewayProvider: aws_ec2.NatInstanceProvider.instance({
        instanceType: new aws_ec2.InstanceType("t2.nano"),
      }),
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "ingress",
          subnetType: aws_ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "application",
          subnetType: aws_ec2.SubnetType.PRIVATE,
        },
        {
          cidrMask: 28,
          name: "rds",
          subnetType: aws_ec2.SubnetType.ISOLATED,
        },
      ],
    });

    // const dbAccessSG = new aws_ec2.SecurityGroup(this, "DBAccessSG", {
    //   vpc,
    //   description: "for accessing database",
    //   securityGroupName: "Database Access",
    // });

    // const dbSG = new aws_ec2.SecurityGroup(this, "DBSG", {
    //   vpc,
    //   description: "for database",
    //   securityGroupName: "Database",
    // });
    // dbSG.addIngressRule(
    //   dbAccessSG,
    //   aws_ec2.Port.tcp(3306),
    //   `from application with sg named ${dbAccessSG.securityGroupName}`
    // );

    this.vpc = vpc;
    // this.dbAccessSG = dbAccessSG;
    // this.dbSG = dbSG;
  }
}
