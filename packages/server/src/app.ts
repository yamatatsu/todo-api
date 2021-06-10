import express from "express";
import { PrismaClient } from "@prisma/client";
import { getDbUrl } from "./constants";

const prismaPromise = getDbUrl().then(
  (url) => new PrismaClient({ datasources: { db: { url } } })
);

const app = express();
export default app;

app.get("/", async (req, res) => {
  const prisma = await prismaPromise;
  const allUsers = await prisma.user.findMany();

  res.send(`Hello World. ${JSON.stringify(allUsers, null, 2)}`);
});
