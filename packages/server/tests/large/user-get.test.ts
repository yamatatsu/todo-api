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

test("404　エラーとなること", async () => {
  const res = await request(app).get(`/user/1`);

  expect(res.status).toEqual(404);
});

test("404　エラーとなること", async () => {
  const res = await request(app).get(`/user/hoge`);

  expect(res.status).toEqual(404);
});
