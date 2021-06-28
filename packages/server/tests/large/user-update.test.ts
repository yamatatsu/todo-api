import request from "supertest";
import createApp from "../../src/app";
import { setupPrisma, getXApigatewayEvent, createUser1 } from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);

test("ユーザーが更新できること", async () => {
  const { user } = await createUser1(prisma);

  const res = await request(createApp())
    .put(`/user`)
    .send({ name: "test-user-name1:updated" })
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual({ count: 1 });
});

test("更新されずに正常を返すこと", async () => {
  const { user } = await createUser1(prisma);

  const res = await request(createApp())
    .put(`/user`)
    .send({})
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual({ count: 1 });
});

/**
 * cognito userは作成したがまだuser createしていない状態で Get user を呼び出した場合
 */
test("404　エラーとなること", async () => {
  const res = await request(createApp())
    .put(`/user`)
    .send({ name: "test-user-name1:updated" })
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("文字数チェックエラーとなること", async () => {
  const { user } = await createUser1(prisma);

  const body = {
    name: "--------10--------20--------30--------40--------50--------60-",
  };
  const res = await request(createApp())
    .put(`/user`)
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
    .put(`/user`)
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
