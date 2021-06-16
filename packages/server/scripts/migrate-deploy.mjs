import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "ap-northeast-1" });

const secretName = process.env.SECRET_NAME;
const command = new GetSecretValueCommand({
  SecretId: secretName,
});
const data = await client.send(command);
const { engine, username, password, host, port } = JSON.parse(
  data.SecretString
);

const databaseEndpoint = process.env.DATABASE_ENDPOINT;

process.env.DATABASE_URL = `${engine}://${username}:${password}@${databaseEndpoint}/tadb?schema=public`;

await $`yarn prisma migrate deploy`;
