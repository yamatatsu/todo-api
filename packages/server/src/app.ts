import express from "express";
import { json } from "body-parser";
import awsServerlessExpressMiddleware from "aws-serverless-express/middleware";
import userGet from "./handlers/userGet";
import userCreate from "./handlers/userCreate";
import userUpdate from "./handlers/userUpdate";
import boardCreate from "./handlers/boardCreate";
import boardUpdate from "./handlers/boardUpdate";
import boardDelete from "./handlers/boardDelete";
import tasksSearch from "./handlers/tasksSearch";
import taskCreate from "./handlers/taskCreate";
import taskUpdate from "./handlers/taskUpdate";
import taskDelete from "./handlers/taskDelete";
import taskFinishedUpdate from "./handlers/taskFinishedUpdate";

export default function createApp(app = express()) {
  app.use((req, res, next) => {
    res.removeHeader("X-Powered-By");
    next();
  });
  app.use(json({ type: "application/json" }));
  app.use(awsServerlessExpressMiddleware.eventContext());

  app.get("/", async (req, res) => {
    res.send("OK.");
  });
  /**
   * 単一のUserを返す。
   * Userに紐づくBoardの一覧も返す
   */
  app.get("/user", userGet);
  /**
   * Userを作成する。
   * 必要なデータの初期化も同時に行う
   */
  app.post("/user", userCreate);
  /**
   * Userを更新する。
   */
  app.put("/user", userUpdate);
  /**
   * Boardを作成する。
   */
  app.post("/board", boardCreate);
  /**
   * Boardを更新する。
   */
  app.put("/board/:boardId", boardUpdate);
  /**
   * Boardを削除する。
   */
  app.delete("/board/:boardId", boardDelete);
  /**
   * Taskの一覧を取得する
   */
  app.get("/board/:boardId/tasks", tasksSearch);
  /**
   * Taskを作成する
   */
  app.post("/board/:boardId/task", taskCreate);
  /**
   * Taskを更新する
   */
  app.put("/board/:boardId/task/:taskId", taskUpdate);
  /**
   * Taskを完了する
   */
  app.put("/board/:boardId/task/:taskId/finished", taskFinishedUpdate);
  /**
   * Taskを削除する
   */
  app.delete("/board/:boardId/task/:taskId", taskDelete);

  return app;
}
