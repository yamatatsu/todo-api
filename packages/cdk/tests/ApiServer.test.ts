import path from "path";
import { SynthUtils } from "@aws-cdk/assert";
import {
  App,
  aws_cognito,
  aws_ec2,
  aws_secretsmanager,
  Stack,
} from "aws-cdk-lib";
import { ApiServerStack } from "../src/ApiServer";

test("snapshot test", () => {
  const app = new App();
  const stack = new Stack(app, "dummyStack");

  const vpc = new aws_ec2.Vpc(stack, "Vpc");
  const securityGroup = new aws_ec2.SecurityGroup(stack, "SecurityGroup", {
    vpc,
  });
  const secret = new aws_secretsmanager.Secret(stack, "Secret");
  const userPool = new aws_cognito.UserPool(stack, "UserPool");

  const target = new ApiServerStack(app, "Target", {
    codeEntry: path.resolve(__dirname, "dummy/src/index.ts"),
    vpc,
    securityGroup,
    dbCredentialSecret: secret,
    proxyEndpoint: "test-proxyEndpoint",
    userPool,
  });

  expect(SynthUtils.toCloudFormation(target)).toMatchSnapshot();
});
