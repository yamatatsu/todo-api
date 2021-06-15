import { SynthUtils } from "@aws-cdk/assert";
import { App, Stack, Environment, aws_ec2 } from "aws-cdk-lib";
import { DatabaseStack } from "../src/Database";
import { AccountId } from "../src/config";

test("snapshot test", () => {
  const env: Environment = {
    region: "ap-northeast-1",
    account: AccountId["development"],
  };

  const app = new App();
  const stack = new Stack(app, "dummyStack", { env });

  const vpc = new aws_ec2.Vpc(stack, "Vpc", {
    subnetConfiguration: [
      { name: "ingress", subnetType: aws_ec2.SubnetType.PUBLIC },
      { name: "application", subnetType: aws_ec2.SubnetType.PRIVATE },
      { name: "rds", subnetType: aws_ec2.SubnetType.ISOLATED },
    ],
  });

  const target = new DatabaseStack(app, "Target", { vpc, env });

  expect(SynthUtils.toCloudFormation(target)).toMatchSnapshot();
});
