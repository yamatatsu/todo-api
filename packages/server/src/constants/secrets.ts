import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { getEnv } from "./env";

type DatabaseSecret = {
  dbClusterIdentifier: string;
  password: string;
  engine: string;
  port: number;
  host: string;
  username: string;
};

const client = new SecretsManagerClient({ region: "ap-northeast-1" });

export async function getSecret(): Promise<DatabaseSecret> {
  const secretName = getEnv("SECRET_NAME");
  const command = new GetSecretValueCommand({
    SecretId: secretName,
  });
  const data = await client.send(command).catch((err) => {
    console.error(err);
    throw err;
  });
  if (!data.SecretString) {
    throw new Error(
      `\`data.SecretString\` is empty. secretName: ${secretName}`
    );
  }
  return JSON.parse(data.SecretString);
}
