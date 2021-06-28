import express from "express";
import createApp from "./app";

const port = 3000;

const app = express();

app.use((req, res, next) => {
  req.headers["x-apigateway-event"] = JSON.stringify({
    requestContext: { authorizer: { claims: { sub: "test-sub" } } },
  });
  req.headers["x-apigateway-context"] = "{}";
  next();
});

createApp(app).listen(port, () => {
  console.info(`Listening on http://localhost:${port}`);
});
