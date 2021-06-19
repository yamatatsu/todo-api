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

  const body = {
    title: "test-task-title:updated",
    description: "test-task-description:updated",
  };
  const res = await request(app)
    .put(`/board/${board.id}/task/${task.id}`)
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

  const body = {
    title: "test-task-title:updated",
    description: "test-task-description:updated",
  };
  const res = await request(app)
    .put(`/board/0/task/${task.id}`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("404エラーとなること", async () => {
  const { user, board } = await createUser1(prisma);

  const body = {
    title: "test-task-title:updated",
    description: "test-task-description:updated",
  };
  const res = await request(app)
    .put(`/board/${board.id}/task/0`)
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

  const body = {
    title: "test-task-title:updated",
    description: "test-task-description:updated",
  };
  const res = await request(app)
    .put(`/board/${board.id}/task/${task.id}`)
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

  const body = {
    title: 1,
    description: "test-task-description:updated",
  };
  const res = await request(app)
    .put(`/board/${board.id}/task/${task.id}`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(400);
});
