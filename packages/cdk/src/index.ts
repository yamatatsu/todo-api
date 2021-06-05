import path from "path";
import { App, Environment } from "aws-cdk-lib";
import { VpcStack } from "./Vpc";
import { DatabaseStack } from "./Database";
import { ApiServerStack } from "./ApiServer";
import { AccountId, assertEnvName } from "./config";

const envName = process.env.ENV_NAME || "development";
assertEnvName(envName);

const app = new App();
const env: Environment = {
  region: "ap-northeast-1",
  account: AccountId[envName],
};

const { vpc } = new VpcStack(app, `${envName}-TodoApi-Vpc`, { env });
const database = new DatabaseStack(app, `${envName}-TodoApi-Database`, {
  vpc,
  env,
});
new ApiServerStack(app, `${envName}-TodoApi-ApiServer`, {
  codeEntry: path.resolve(__dirname, "../../server/src/index.ts"),
  vpc,
  dbHost: database.dbHost,
  dbPort: database.dbPort,
  dbCredentialSecretName: database.dbCredentialSecretName,
  env,
});
