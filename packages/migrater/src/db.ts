import { fromIni } from "@aws-sdk/credential-provider-ini";
import {
  RDSDataClient,
  ExecuteStatementCommand,
  SqlParameter,
  BeginTransactionCommand,
  CommitTransactionCommand,
  RollbackTransactionCommand,
} from "@aws-sdk/client-rds-data";

const client = new RDSDataClient({
  region: "ap-northeast-1",
  credentials: fromIni(),
});

const commonInput = {
  resourceArn: process.env.RESOURCE_ARN,
  secretArn: process.env.SECRET_ARN,
  database: process.env.DATABASE_NAME,
};

export const beginTransaction = () => {
  const command = new BeginTransactionCommand({
    ...commonInput,
  });
  return client.send(command);
};
export const commitTransaction = (transactionId: string) => {
  const command = new CommitTransactionCommand({
    ...commonInput,
    transactionId,
  });
  return client.send(command);
};
export const rollbackTransaction = (transactionId: string) => {
  const command = new RollbackTransactionCommand({
    ...commonInput,
    transactionId,
  });
  return client.send(command);
};

export const executeStatement = (
  sql: string,
  transactionId?: string,
  parameters?: SqlParameter[]
) => {
  const command = new ExecuteStatementCommand({
    ...commonInput,
    sql,
    parameters,
    transactionId,
  });
  return client.send(command);
};
