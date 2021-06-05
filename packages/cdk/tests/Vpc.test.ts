import { SynthUtils } from "@aws-cdk/assert";
import { App, Environment } from "aws-cdk-lib";
import { VpcStack } from "../src/Vpc";
import { AccountId } from "../src/config";

test("snapshot test", () => {
  const app = new App();
  const env: Environment = {
    region: "ap-northeast-1",
    account: AccountId["development"],
  };

  const target = new VpcStack(app, "Target", { env });

  expect(SynthUtils.toCloudFormation(target)).toMatchSnapshot();
});
