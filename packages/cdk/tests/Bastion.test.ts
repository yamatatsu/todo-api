import { SynthUtils } from "@aws-cdk/assert";
import { App, aws_ec2, Stack } from "aws-cdk-lib";
import { BastionStack } from "../src/Bastion";

test("snapshot test", () => {
  const app = new App();
  const stack = new Stack(app, "dummyStack");

  const vpc = new aws_ec2.Vpc(stack, "Vpc");
  const securityGroup = new aws_ec2.SecurityGroup(stack, "SecurityGroup", {
    vpc,
  });

  const target = new BastionStack(app, "Target", {
    vpc,
    securityGroup,
  });

  expect(SynthUtils.toCloudFormation(target)).toMatchSnapshot();
});
