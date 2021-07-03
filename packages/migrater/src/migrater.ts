import path from "path";
import Umzug from "umzug";
import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
  executeStatement,
} from "./db";

export type MigrationFn = (
  _executeStatement: typeof executeStatement,
  transactionId: string
) => Promise<void>;
type WrapFn = <Fn>(fn: Fn) => Fn;

/**
 * Migrationファイルの実行をtransactionでラップする
 *
 * @ts-ignore `<T>(fn: T) => T` を攻略できなかった。。。 */
const wrap: WrapFn =
  // 以下は ts-ignore の影響を受けたくないので改行する
  (fn: MigrationFn): MigrationFn => {
    if (!(fn instanceof Function)) {
      throw new Error();
    }
    const wrappedFn = async (_executeStatement: typeof executeStatement) => {
      const { transactionId } = await beginTransaction();
      if (!transactionId) {
        throw new Error("No transactionId was provided.");
      }

      try {
        await fn(_executeStatement, transactionId);
        await commitTransaction(transactionId);
      } catch (error) {
        await rollbackTransaction(transactionId);
        throw error;
      }
    };
    return wrappedFn;
  };

export const umzug = new Umzug({
  logging: (...props: any) => console.log(props),
  migrations: {
    path: path.join(__dirname, "./migrations"),
    params: [executeStatement],
    wrap,
  },
});
