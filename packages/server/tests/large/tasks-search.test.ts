import request from "supertest";
import createApp from "../../src/app";
import { createUser1, getXApigatewayEvent, setupPrisma } from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);

test("keywordを指定しない場合、boardのすべてのTaskが取得できること", async () => {
  const { user, board } = await createUser1(prisma);
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
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

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
    .send({ keyword: "" })
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

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
test("keywordが含まれるTaskが取得できること", async () => {
  const { user, board } = await createUser1(prisma);
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
    .send({ keyword: "いちご" })
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.body).toEqual(
    expect.arrayContaining([
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
    ])
  );
});

test("404　エラーとなること", async () => {
  const { user } = await createUser1(prisma);

  const res = await request(createApp())
    .get(`/board/0/tasks`)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("404　エラーとなること", async () => {
  const data = await prisma.user.create({
    data: {
      sub: "test-user-sub1",
      name: "test-user-name1",
      boards: {
        create: {
          title: "test-board-title1",
          tasks: {
            create: [
              { title: "test-task-title1" },
              { title: "test-task-title2" },
            ],
          },
        },
      },
    },
    include: { boards: { include: { tasks: true } } },
  });

  const res = await request(createApp())
    .get(`/board/${data.boards[0].id}/tasks`)
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});
