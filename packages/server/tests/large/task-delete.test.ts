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

test("Taskが削除できること", async () => {
  const {
    user,
    board,
    tasks: [task],
  } = await createUser1(prisma);

  const res = await request(createApp())
    .delete(`/board/${board.id}/task/${task.id}`)
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

  const res = await request(createApp())
    .delete(`/board/0/task/${task.id}`)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("存在しないtaskIdの場合、404エラーとなること", async () => {
  const { user, board } = await createUser1(prisma);

  const res = await request(createApp())
    .delete(`/board/${board.id}/task/0`)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("Userが存在しない場合、404エラーとなること", async () => {
  const {
    board,
    tasks: [task],
  } = await createUser1(prisma);

  const res = await request(createApp())
    .delete(`/board/${board.id}/task/${task.id}`)
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("他人のBoardのTaskが削除できないこと", async () => {
  const {
    user,
    board,
    tasks: [task],
  } = await createUser1(prisma);
  const { user: user2 } = await createUser2(prisma);

  const res = await request(createApp())
    .delete(`/board/${board.id}/task/${task.id}`)
    .set("x-apigateway-event", getXApigatewayEvent(user2.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("Boardに存在しないTaskが削除できないこと", async () => {
  const {
    user,
    board,
    board2,
    tasks: [task],
  } = await createUser1(prisma);

  const res = await request(createApp())
    .delete(`/board/${board2.id}/task/${task.id}`)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});
