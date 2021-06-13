import express from "express";
import { json } from "body-parser";
import userGet from "./handlers/userGet";
import userCreate from "./handlers/userCreate";

const app = express();
export default app;

app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});
app.use(json({ type: "application/json" }));

app.get("/", async (req, res) => {
  res.send("OK.");
});
app.get("/user/:id", userGet);
app.post("/user", userCreate);
