import express from "express";
import createApp from "./app";

const port = 3000;

const app = express();

app.use((req, res, next) => {
  req.apiGateway = {
    // @ts-ignore
    event: { requestContext: { authorizer: { claims: { sub: "test-sub" } } } },
  };
  next();
});

createApp(app).listen(port, () => {
  console.info(`Listening on http://localhost:${port}`);
});
