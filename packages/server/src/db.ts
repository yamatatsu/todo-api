import { PrismaClient } from "@prisma/client";
import { getDbUrl } from "./constants";

/**
 * node のファイル読み込みの時点でdbとのつなぎこみを開始するために、ファイルのトップレベルでPromiseを生成する
 */

const prismaPromise = getDbUrl().then(
  (url) => new PrismaClient({ datasources: { db: { url } } })
);

export default function getPrisma() {
  return prismaPromise;
}
