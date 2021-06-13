import request from "supertest";
import app from "../../src/app";
import { setupPrisma } from "./helper";

const prisma = setupPrisma();

test("単一のユーザーが取得できること", async () => {
  const data = await prisma.user.create({
    data: { sub: "test-sub", name: "test-name" },
  });
  const res = await request(app).get(`/user/${data.id}`);

  expect(res.body).toEqual(data);
});
