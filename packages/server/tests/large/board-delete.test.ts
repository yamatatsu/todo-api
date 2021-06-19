import request from "supertest";
import app from "../../src/app";
import { setupPrisma, getXApigatewayEvent, createUser1 } from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);

test("Boardが削除できること", async () => {
  const { user, board } = await createUser1(prisma);

  const res = await request(app)
    .delete(`/board/${board.id}`)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual({
    count: 1,
  });
});

test("404エラーとなること", async () => {
  const { user } = await createUser1(prisma);

  const res = await request(app)
    .delete(`/board/dummy-boardId`)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("404エラーとなること", async () => {
  const { board } = await createUser1(prisma);

  const res = await request(app)
    .delete(`/board/${board.id}`)
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});
