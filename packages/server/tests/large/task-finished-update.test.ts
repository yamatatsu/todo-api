import request from "supertest";
import createApp from "../../src/app";
import {
  setupPrisma,
  getXApigatewayEvent,
  createUser1,
  createUser2,
} from "./helper";

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

test("存在しないboardIdの場合、404エラーとなること", async () => {
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

test("存在しないtaskIdの場合、404エラーとなること", async () => {
  const { user, board } = await createUser1(prisma);

  const body = { finished: true };
  const res = await request(createApp())
    .put(`/board/${board.id}/task/0/finished`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("Userが存在しない場合、404エラーとなること", async () => {
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

test("finishedがbooleanではない場合、400エラーとなること", async () => {
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
  expect(res.body).toEqual({
    issues: [
      {
        code: "invalid_type",
        expected: "boolean",
        message: "Expected boolean, received string",
        path: ["finished"],
        received: "string",
      },
    ],
  });
});

test("他人のTask.finishedが更新できないこと", async () => {
  const {
    user,
    board,
    tasks: [task],
  } = await createUser1(prisma);
  const { user: user2 } = await createUser2(prisma);

  const body = { finished: true };
  const res = await request(createApp())
    .put(`/board/${board.id}/task/${task.id}/finished`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user2.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("Boardに存在しないTaskのTask.finishedが更新できないこと", async () => {
  const {
    user,
    board,
    board2,
    tasks: [task],
  } = await createUser1(prisma);

  const body = { finished: true };
  const res = await request(createApp())
    .put(`/board/${board2.id}/task/${task.id}/finished`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});
