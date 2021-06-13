import express from "express";
import { json } from "body-parser";
import userGet from "./handlers/userGet";
import userCreate from "./handlers/userCreate";

const app = express();
export default app;

app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});
app.use(json({ type: "application/json" }));

app.get("/", async (req, res) => {
  res.send("OK.");
});
/**
 * 単一のUserを返す。
 * Userに紐づくBoardの一覧も返す
 */
app.get("/user/:id", userGet);
/**
 * Userを作成する。
 * 必要なデータの初期化も同時に行う
 */
app.post("/user", userCreate);
/**
 * Boardを作成する。
 */
// app.post("/user/:id/board", boardCreate);
/**
 * Taskの一覧を取得する
 */
// app.get("/board/:boardId/tasks", tasksSearch);
/**
 * Taskを作成する
 */
// app.post("/board/:boardId/task", taskCreate);
/**
 * Taskを更新する
 */
// app.put("/board/:boardId/task/:taskId", taskPut);
/**
 * Taskを削除する
 */
// app.delete("/board/:boardId/task/:taskId", taskDelete);
