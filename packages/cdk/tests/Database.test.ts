import { SynthUtils } from "@aws-cdk/assert";
import { App, Environment } from "aws-cdk-lib";
import { VpcStack } from "../src/Vpc";
import { DatabaseStack } from "../src/Database";
import { AccountId } from "../src/config";

test("snapshot test", () => {
  const app = new App();
  const env: Environment = {
    region: "ap-northeast-1",
    account: AccountId["development"],
  };

  const { vpc } = new VpcStack(app, "Vpc", { env });

  const target = new DatabaseStack(app, "Target", { vpc, env });

  expect(SynthUtils.toCloudFormation(target)).toMatchSnapshot();
});
