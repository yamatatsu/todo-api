import path from "path";
import { SynthUtils } from "@aws-cdk/assert";
import { App, aws_ec2, aws_rds, Stack } from "aws-cdk-lib";
import { ApiServerStack } from "../src/ApiServer";

test("snapshot test", () => {
  const app = new App();
  const stack = new Stack(app, "dummyStack");

  const vpc = new aws_ec2.Vpc(stack, "Vpc");
  const securityGroup = new aws_ec2.SecurityGroup(stack, "SecurityGroup", {
    vpc,
  });
  const dbCluster = new aws_rds.ServerlessCluster(stack, "ServerlessCluster", {
    engine: aws_rds.DatabaseClusterEngine.AURORA,
    vpc,
  });

  const target = new ApiServerStack(app, "Target", {
    codeEntry: path.resolve(__dirname, "dummy/src/index.ts"),
    vpc,
    securityGroup,
    dbCredentialSecret: dbCluster.secret!,
    userPoolArn: "test-userPoolArn",
  });

  expect(SynthUtils.toCloudFormation(target)).toMatchSnapshot();
});
