import { APIGatewayProxyHandler } from "aws-lambda";
import awsServerlessExpress from "aws-serverless-express";
import createApp from "./app";

const app = createApp();
const server = awsServerlessExpress.createServer(app);

export const handler: APIGatewayProxyHandler = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  awsServerlessExpress.proxy(server, event, context);
};
