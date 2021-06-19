import { PrismaClient } from "@prisma/client";
import { getDbUrl } from "./constants";

/**
 * PrismaClient を生成する。
 * AWS SecretManager から取得した情報をもとにDB接続するため、Prisma公式にあるような環境変数にDATABASE_URLを用意して接続する方法が使えない。
 * そのため、`new PrismaClient()` の引数にurlを渡す方法で実装している。
 *
 * node のファイル読み込みの時点でdbとのつなぎこみを開始するために、ファイルのトップレベルでPromiseを生成する
 */

const prismaPromise = getDbUrl().then(
  (url) => new PrismaClient({ datasources: { db: { url } } })
);

export default function getPrisma() {
  return prismaPromise;
}
