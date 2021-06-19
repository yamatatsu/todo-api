import request from "supertest";
import app from "../../src/app";
import { setupPrisma, getXApigatewayEvent } from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);

test("Task.finishedが更新できること", async () => {
  const user = await prisma.user.create({
    data: {
      sub: "test-sub",
      name: "test-name",
      boards: {
        create: {
          title: "test-board-title",
          description: "test-description-description",
          tasks: {
            create: {
              title: "test-task-title",
              description: "test-task-description",
            },
          },
        },
      },
    },
    include: { boards: { include: { tasks: true } } },
  });

  const board = user.boards[0];
  const task = board.tasks[0];

  const body = { finished: true };
  const res = await request(app)
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
  const user = await prisma.user.create({
    data: {
      sub: "test-sub",
      name: "test-name",
      boards: {
        create: {
          title: "test-board-title",
          description: "test-description-description",
          tasks: {
            create: {
              title: "test-task-title",
              description: "test-task-description",
            },
          },
        },
      },
    },
    include: { boards: { include: { tasks: true } } },
  });

  const board = user.boards[0];
  const task = board.tasks[0];

  const body = { finished: true };
  const res = await request(app)
    .put(`/board/0/task/${task.id}/finished`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("404エラーとなること", async () => {
  const user = await prisma.user.create({
    data: {
      sub: "test-sub",
      name: "test-name",
      boards: {
        create: {
          title: "test-board-title",
          description: "test-description-description",
          tasks: {
            create: {
              title: "test-task-title",
              description: "test-task-description",
            },
          },
        },
      },
    },
    include: { boards: { include: { tasks: true } } },
  });

  const board = user.boards[0];
  const task = board.tasks[0];

  const body = { finished: true };
  const res = await request(app)
    .put(`/board/${board.id}/task/0/finished`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("404エラーとなること", async () => {
  const user = await prisma.user.create({
    data: {
      sub: "test-sub",
      name: "test-name",
      boards: {
        create: {
          title: "test-board-title",
          description: "test-description-description",
          tasks: {
            create: {
              title: "test-task-title",
              description: "test-task-description",
            },
          },
        },
      },
    },
    include: { boards: { include: { tasks: true } } },
  });

  const board = user.boards[0];
  const task = board.tasks[0];

  const body = { finished: true };
  const res = await request(app)
    .put(`/board/${board.id}/task/${task.id}/finished`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("400エラーとなること", async () => {
  const user = await prisma.user.create({
    data: {
      sub: "test-sub",
      name: "test-name",
      boards: {
        create: {
          title: "test-board-title",
          description: "test-description-description",
          tasks: {
            create: {
              title: "test-task-title",
              description: "test-task-description",
            },
          },
        },
      },
    },
    include: { boards: { include: { tasks: true } } },
  });

  const board = user.boards[0];
  const task = board.tasks[0];

  const body = { finished: "hoge" };
  const res = await request(app)
    .put(`/board/${board.id}/task/${task.id}/finished`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(400);
});
