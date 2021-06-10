import path from "path";
import { App, Environment } from "aws-cdk-lib";
import { CognitoStack } from "./Cognito";
import { VpcStack } from "./Vpc";
import { DatabaseStack } from "./Database";
import { ApiServerStack } from "./ApiServer";
import { BastionStack } from "./Bastion";
import { AccountId, assertEnvName } from "./config";

const envName = process.env.ENV_NAME || "development";
assertEnvName(envName);

const app = new App();
const env: Environment = {
  region: "ap-northeast-1",
  account: AccountId[envName],
};

const cognito = new CognitoStack(app, `${envName}-TodoApi-Cognito`, { env });
const { vpc, dbSG, dbAccessSG } = new VpcStack(app, `${envName}-TodoApi-Vpc`, {
  env,
});
const database = new DatabaseStack(app, `${envName}-TodoApi-Database`, {
  vpc,
  securityGroup: dbSG,
  env,
});
new ApiServerStack(app, `${envName}-TodoApi-ApiServer`, {
  codeEntry: path.resolve(__dirname, "../../server/src/index.ts"),
  vpc,
  securityGroup: dbAccessSG,
  dbCredentialSecret: database.dbCredentialSecret,
  userPoolArn: cognito.userPoolArn,
  env,
});
new BastionStack(app, `${envName}-TodoApi-Bastion`, {
  vpc,
  securityGroup: dbAccessSG,
  env,
});
