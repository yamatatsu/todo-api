import path from "path";
import { SynthUtils } from "@aws-cdk/assert";
import {
  App,
  aws_cognito,
  aws_ec2,
  aws_secretsmanager,
  Stack,
} from "aws-cdk-lib";
import { MigraterStack } from "../src/Migrater";

test("snapshot test", () => {
  const app = new App();
  const stack = new Stack(app, "dummyStack");

  const vpc = new aws_ec2.Vpc(stack, "Vpc", {
    subnetConfiguration: [
      { name: "application", subnetType: aws_ec2.SubnetType.ISOLATED },
      { name: "rds", subnetType: aws_ec2.SubnetType.ISOLATED },
    ],
  });
  const securityGroup = new aws_ec2.SecurityGroup(stack, "SecurityGroup", {
    vpc,
  });
  const secret = new aws_secretsmanager.Secret(stack, "Secret");

  const target = new MigraterStack(app, "Target", {
    dockerfilePath: path.resolve(__dirname, "./dummy"),
    vpc,
    securityGroup,
    dbCredentialSecret: secret,
    proxyEndpoint: "test-proxyEndpoint",
  });

  expect(SynthUtils.toCloudFormation(target)).toMatchSnapshot();
});
