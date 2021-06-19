import request from "supertest";
import app from "../../src/app";
import { setupPrisma, getXApigatewayEvent, createUser1 } from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);

test("Taskが更新できること", async () => {
  const {
    user,
    board,
    tasks: [task],
  } = await createUser1(prisma);

  const res = await request(app)
    .delete(`/board/${board.id}/task/${task.id}`)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual({
    count: 1,
  });
});

test("404エラーとなること", async () => {
  const {
    user,
    tasks: [task],
  } = await createUser1(prisma);

  const res = await request(app)
    .delete(`/board/0/task/${task.id}`)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("404エラーとなること", async () => {
  const { user, board } = await createUser1(prisma);

  const res = await request(app)
    .delete(`/board/${board.id}/task/0`)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("404エラーとなること", async () => {
  const {
    board,
    tasks: [task],
  } = await createUser1(prisma);

  const res = await request(app)
    .delete(`/board/${board.id}/task/${task.id}`)
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});
