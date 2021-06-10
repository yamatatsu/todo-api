import { SynthUtils } from "@aws-cdk/assert";
import { App } from "aws-cdk-lib";
import { CognitoStack } from "../src/Cognito";

test("snapshot test", () => {
  const app = new App();

  const target = new CognitoStack(app, "Target", {});

  expect(SynthUtils.toCloudFormation(target)).toMatchSnapshot();
});
