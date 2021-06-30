import request from "supertest";
import createApp from "../../src/app";
import {
  createUser1,
  createUser2,
  getXApigatewayEvent,
  setupPrisma,
} from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);

test("keywordを指定しない場合、boardのすべてのTaskが取得できること", async () => {
  const { user, board } = await createUser1(prisma);

  const res = await request(createApp())
    .get(`/board/${board.id}/tasks`)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual([
    {
      id: expect.any(Number),
      boardId: board.id,
      title: "りんご いちご ぶどう",
      description: "りんご ばなな ぶどう",
      finished: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
    {
      id: expect.any(Number),
      boardId: board.id,
      title: "りんご ばなな ぶどう",
      description: "りんご ばなな ぶどう",
      finished: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
    {
      id: expect.any(Number),
      boardId: board.id,
      title: "りんご ばなな ぶどう",
      description: "りんご いちご ぶどう",
      finished: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  ]);
});
test("keywordが空文字の場合、boardのすべてのTaskが取得できること", async () => {
  const { user, board } = await createUser1(prisma);

  const res = await request(createApp())
    .get(`/board/${board.id}/tasks`)
    .query({ keyword: "" })
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual([
    {
      id: expect.any(Number),
      boardId: board.id,
      title: "りんご いちご ぶどう",
      description: "りんご ばなな ぶどう",
      finished: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
    {
      id: expect.any(Number),
      boardId: board.id,
      title: "りんご ばなな ぶどう",
      description: "りんご ばなな ぶどう",
      finished: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
    {
      id: expect.any(Number),
      boardId: board.id,
      title: "りんご ばなな ぶどう",
      description: "りんご いちご ぶどう",
      finished: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  ]);
});
test("keywordが指定された場合、keywordが含まれるTaskが取得できること", async () => {
  const { user, board } = await createUser1(prisma);

  const res = await request(createApp())
    .get(`/board/${board.id}/tasks`)
    .query({ keyword: "いちご" })
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual([
    {
      id: expect.any(Number),
      boardId: board.id,
      title: "りんご いちご ぶどう",
      description: "りんご ばなな ぶどう",
      finished: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
    {
      id: expect.any(Number),
      boardId: board.id,
      title: "りんご ばなな ぶどう",
      description: "りんご いちご ぶどう",
      finished: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  ]);
});

test("finished:false を指定した場合、boardのすべてのfinished Taskが取得できること", async () => {
  const { user, board } = await createUser1(prisma);

  const res = await request(createApp())
    .get(`/board/${board.id}/tasks`)
    .query({ finished: true })
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual([
    {
      id: expect.any(Number),
      boardId: board.id,
      title: "DONEしたtask",
      description: "DONEしたtask",
      finished: true,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
    {
      id: expect.any(Number),
      boardId: board.id,
      title: "DONEしたtask",
      description: "DONEしたtask 検索用キー:わかめ",
      finished: true,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  ]);
});

test("finishedとkeywordが同時に動作すること", async () => {
  const { user, board } = await createUser1(prisma);

  const res = await request(createApp())
    .get(`/board/${board.id}/tasks`)
    .query({ finished: true, keyword: "わかめ" })
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual([
    {
      id: expect.any(Number),
      boardId: board.id,
      title: "DONEしたtask",
      description: "DONEしたtask 検索用キー:わかめ",
      finished: true,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  ]);
});

test("存在しないboardIdの場合、404エラーとなること", async () => {
  const { user } = await createUser1(prisma);

  const res = await request(createApp())
    .get(`/board/0/tasks`)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("Userが存在しない場合、404エラーとなること", async () => {
  const { board } = await createUser1(prisma);

  const res = await request(createApp())
    .get(`/board/${board.id}/tasks`)
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("他人のboardのTaskが取得できないこと", async () => {
  const { user, board } = await createUser1(prisma);
  const { user: user2 } = await createUser2(prisma);

  await prisma.board.create({
    data: {
      authorId: user.id,
      title: "test-board-title2",
      tasks: { create: [{ title: "test-task-title3" }] },
    },
    include: { tasks: true },
  });

  const res = await request(createApp())
    .get(`/board/${board.id}/tasks`)
    .set("x-apigateway-event", getXApigatewayEvent(user2.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});
