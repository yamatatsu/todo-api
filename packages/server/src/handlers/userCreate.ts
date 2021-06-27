import { Handler } from "express";
import { Prisma } from "@prisma/client";
import getPrisma from "../db";
import { getSub } from "./lib";
import { schemaForCreate } from "../models/user";

const handler: Handler = async (req, res) => {
  console.info("Start " + __filename.match(/[\w-]+\.ts$/)?.[0]);

  const sub = getSub(req);

  const validationResult = schemaForCreate.safeParse({ ...req.body, sub });
  if (!validationResult.success) {
    res.status(400).json(validationResult.error);
    return;
  }

  const prisma = await getPrisma();

  let result;
  try {
    result = await prisma.user.create({
      data: {
        ...validationResult.data,
        sub,
        boards: {
          create: {
            title: "Default",
            tasks: { create: { title: "Great Awesome Tutorial" } },
          },
        },
      },
      include: { boards: { include: { tasks: true } } },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(400).json({
          message: "A same sub user has found. This user has already created.",
        });
        return;
      }
    }
    throw error;
  }

  res.json({ count: 1 });
};
export default handler;
