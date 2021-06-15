import path from "path";
import { App, Environment } from "aws-cdk-lib";
import { CognitoStack } from "./Cognito";
import { VpcStack } from "./Vpc";
import { DatabaseStack } from "./Database";
import { DatabaseProxyStack } from "./DatabaseProxy";
import { ApiServerStack } from "./ApiServer";
import { MigraterStack } from "./Migrater";
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
const { vpc } = new VpcStack(app, `${envName}-TodoApi-Vpc`, {
  env,
});
const database = new DatabaseStack(app, `${envName}-TodoApi-Database`, {
  vpc,
  // securityGroup: dbSG,
  env,
});
// new DatabaseProxyStack(app, `${envName}-TodoApi-DatabaseProxy`, {
//   vpc,
//   securityGroup: dbSG,
//   cluster: database.dbCluster,
//   secret: database.dbCredentialSecret,
//   env,
// });
new ApiServerStack(app, `${envName}-TodoApi-ApiServer`, {
  codeEntry: path.resolve(__dirname, "../../server/src/index.ts"),
  vpc,
  securityGroup: database.dbAccessSG,
  dbCredentialSecret: database.dbCredentialSecret,
  proxyEndpoint: database.proxy.endpoint,
  userPool: cognito.userPool,
  env,
});
new MigraterStack(app, `${envName}-TodoApi-Migrater`, {
  dockerfilePath: path.resolve(__dirname, "../../server"),
  vpc,
  securityGroup: database.dbAccessSG,
  dbCredentialSecret: database.dbCredentialSecret,
  env,
});
new BastionStack(app, `${envName}-TodoApi-Bastion`, {
  vpc,
  securityGroup: database.dbAccessSG,
  env,
});
