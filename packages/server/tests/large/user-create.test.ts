import request from "supertest";
import createApp from "../../src/app";
import {
  setupPrisma,
  createUser1,
  sampleUuid,
  getXApigatewayEvent,
} from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);

test("ユーザーが作成できること", async () => {
  const body = { name: "test-name" };
  const res = await request(createApp())
    .post("/user")
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(sampleUuid))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual({ count: 1 });
});

test("必須チェックエラーとなること", async () => {
  const body = {};
  const res = await request(createApp())
    .post("/user")
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(sampleUuid))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(400);
  expect(res.body).toEqual({
    issues: [
      {
        code: "invalid_type",
        expected: "string",
        message: "Required",
        path: ["name"],
        received: "undefined",
      },
    ],
  });
});

test("Unique制約エラーとなること", async () => {
  const { user } = await createUser1(prisma);

  const res = await request(createApp())
    .post("/user")
    .send({ name: "test-name2" })
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(400);
  expect(res.body).toEqual({
    message: "A same sub user has found. This user has already created.",
  });
});

test("文字数チェックエラーとなること", async () => {
  const { user } = await createUser1(prisma);

  const body = {
    name: "--------10--------20--------30--------40--------50--------60-",
  };
  const res = await request(createApp())
    .post("/user")
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(400);
  expect(res.body).toEqual({
    issues: [
      {
        code: "too_big",
        inclusive: true,
        maximum: 60,
        message: "Should be at most 60 characters long",
        path: ["name"],
        type: "string",
      },
    ],
  });
});

test("有効文字チェックエラーとなること", async () => {
  const { user } = await createUser1(prisma);

  const body = {
    name: `hoge\nhoge`,
  };
  const res = await request(createApp())
    .post("/user")
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(400);
  expect(res.body).toEqual({
    issues: [
      {
        code: "invalid_string",
        message: "Invalid",
        path: ["name"],
        validation: "regex",
      },
    ],
  });
});
