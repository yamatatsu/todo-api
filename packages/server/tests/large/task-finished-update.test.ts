import request from "supertest";
import createApp from "../../src/app";
import { setupPrisma, getXApigatewayEvent, createUser1 } from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);

test("Task.finishedが更新できること", async () => {
  const {
    user,
    board,
    tasks: [task],
  } = await createUser1(prisma);

  const body = { finished: true };
  const res = await request(createApp())
    .put(`/board/${board.id}/task/${task.id}/finished`)
    .send(body)
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

  const body = { finished: true };
  const res = await request(createApp())
    .put(`/board/0/task/${task.id}/finished`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("404エラーとなること", async () => {
  const { user, board } = await createUser1(prisma);

  const body = { finished: true };
  const res = await request(createApp())
    .put(`/board/${board.id}/task/0/finished`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("404エラーとなること", async () => {
  const {
    board,
    tasks: [task],
  } = await createUser1(prisma);

  const body = { finished: true };
  const res = await request(createApp())
    .put(`/board/${board.id}/task/${task.id}/finished`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("400エラーとなること", async () => {
  const {
    user,
    board,
    tasks: [task],
  } = await createUser1(prisma);

  const body = { finished: "hoge" };
  const res = await request(createApp())
    .put(`/board/${board.id}/task/${task.id}/finished`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(400);
});
