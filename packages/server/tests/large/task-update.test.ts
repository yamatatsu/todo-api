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
  const res = await request(createApp())
    .put(`/board/${board.id}/task/${task.id}`)
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

  const body = {
    title: "test-task-title:updated",
    description: "test-task-description:updated",
  };
  const res = await request(createApp())
    .put(`/board/0/task/${task.id}`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("存在しないtaskIdの場合、404エラーとなること", async () => {
  const { user, board } = await createUser1(prisma);

  const body = {
    title: "test-task-title:updated",
    description: "test-task-description:updated",
  };
  const res = await request(createApp())
    .put(`/board/${board.id}/task/0`)
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

  const body = {
    title: "test-task-title:updated",
    description: "test-task-description:updated",
  };
  const res = await request(createApp())
    .put(`/board/${board.id}/task/${task.id}`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("titleがが文字列ではない場合、400エラーとなること", async () => {
  const {
    user,
    board,
    tasks: [task],
  } = await createUser1(prisma);

  const body = {
    title: 1,
    description: "test-task-description:updated",
  };
  const res = await request(createApp())
    .put(`/board/${board.id}/task/${task.id}`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(400);
  expect(res.body).toEqual({
    issues: [
      {
        code: "invalid_type",
        expected: "string",
        message: "Expected string, received number",
        path: ["title"],
        received: "number",
      },
    ],
  });
});

test("文字数チェックエラーとなること", async () => {
  const {
    user,
    board,
    tasks: [task],
  } = await createUser1(prisma);

  const body = {
    title: "--------10--------20--------30--------40--------50-",
    description:
      "-------------------------------------------------------------------------------------------------100-------------------------------------------------------------------------------------------------200-------------------------------------------------------------------------------------------------300-------------------------------------------------------------------------------------------------400-------------------------------------------------------------------------------------------------500-",
  };
  const res = await request(createApp())
    .put(`/board/${board.id}/task/${task.id}`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(400);
  expect(res.body).toEqual({
    issues: [
      {
        code: "too_big",
        inclusive: true,
        maximum: 50,
        message: "Should be at most 50 characters long",
        path: ["title"],
        type: "string",
      },
      {
        code: "too_big",
        inclusive: true,
        maximum: 500,
        message: "Should be at most 500 characters long",
        path: ["description"],
        type: "string",
      },
    ],
  });
});

test("有効文字チェックエラーとなること", async () => {
  const {
    user,
    board,
    tasks: [task],
  } = await createUser1(prisma);

  const body = {
    title: `hoge\nhoge`,
    description: "test-description",
  };
  const res = await request(createApp())
    .put(`/board/${board.id}/task/${task.id}`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(400);
  expect(res.body).toEqual({
    issues: [
      {
        code: "invalid_string",
        message: "Invalid",
        path: ["title"],
        validation: "regex",
      },
    ],
  });
});

test("`<`と`>`がサニタイズされること", async () => {
  const {
    user,
    board,
    tasks: [task],
  } = await createUser1(prisma);

  const body = {
    title: "<><>",
    description: "<><>",
  };
  const res = await request(createApp())
    .put(`/board/${board.id}/task/${task.id}`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);

  const { title, description } =
    (await prisma.task.findUnique({ where: { id: task.id } })) ?? {};
  expect({ title, description }).toEqual({
    title: "&lt;&gt;&lt;&gt;",
    description: "&lt;&gt;&lt;&gt;",
  });
});

test("他人のTaskが更新できないこと", async () => {
  const {
    user,
    board,
    tasks: [task],
  } = await createUser1(prisma);
  const { user: user2 } = await createUser2(prisma);

  const body = {
    title: "test-task-title:updated",
    description: "test-task-description:updated",
  };
  const res = await request(createApp())
    .put(`/board/${board.id}/task/${task.id}`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user2.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("Boardに存在しないTaskが更新できないこと", async () => {
  const {
    user,
    board,
    board2,
    tasks: [task],
  } = await createUser1(prisma);

  const body = {
    title: "test-task-title:updated",
    description: "test-task-description:updated",
  };
  const res = await request(createApp())
    .put(`/board/${board2.id}/task/${task.id}`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});
