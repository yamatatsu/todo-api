import request from "supertest";
import app from "../../src/app";
import { setupPrisma, getXApigatewayEvent } from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);

test("ユーザーが更新できること", async () => {
  const data = await prisma.user.create({
    data: { sub: "test-sub", name: "test-name" },
  });
  const res = await request(app)
    .put(`/user`)
    .send({ name: "test-name-updated" })
    .set("x-apigateway-event", getXApigatewayEvent(data.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual({
    ...data,
    name: "test-name-updated",
  });
});

test("必須チェックエラーとなること", async () => {
  const data = await prisma.user.create({
    data: { sub: "test-sub", name: "test-name" },
  });
  const res = await request(app)
    .put(`/user`)
    .send({})
    .set("x-apigateway-event", getXApigatewayEvent(data.sub))
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

/**
 * cognito userは作成したがまだuser createしていない状態で Get user を呼び出した場合
 */
test("404　エラーとなること", async () => {
  const res = await request(app)
    .put(`/user`)
    .send({ name: "test-name-updated" })
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});
