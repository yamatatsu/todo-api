# todo-api

## setup

### setup mysql

- install mysql
- create user
- create database
- permit user to access database

### yarn install

```sh
yarn
```

### .env file

```sh
cp packages/server/.env.example packages/server/.env
```

fix `DATABASE_URL=""` in packages/server/.env as following:
https://www.prisma.io/docs/concepts/database-connectors/mysql#connection-url

### prisma migrate

```sh
cd packages/server
yarn prisma migrate
```

### start server

```sh
cd packages/server
yarn start
```

## deploying

```sh
yarn
cd packages/cdk
yarn cdk deploy --all
```

## db migration

適切な IAM 権限を持って以下を実行する

```sh
aws lambda invoke --function-name development-TodoApi-Migrater-Fn /dev/stdout
```

## load map

1. architecture overview
   - [x] base of cdk
   - [x] deploy all resourse
   - [x] integration
   - [x] db migration pipline
1. rest server on local
   - [x] setup prisma
     - https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch-typescript-postgres
     - https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database
     - https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
   - [x] setup express
   - [x] express on lambda
   - [ ] restful api
     - [ ] search tasks
1. integration
   - [x] e2e test
   - [ ] documentation
1. definition of done
   - [ ] design of architecture
   - [ ] documentation of design
   - [ ] implimentation
   - [ ] test code
   - [ ] playbook for launching application
1. タスク
   - [x] Cognito 込みでテストできる画面
   - [x] User の createdAt と updatedAt 忘れてた
   - [ ] アーキテクチャの文書化
   - API インターフェースの見直しと文書化
     - [ ] 入力チェック見直し
     - [ ] テスト: status の expext を追加
     - [ ] エラーレスポンスの統一
   - 実装の見直し
     - [ ] トランザクション見直し
   - 運用
     - [ ] ログ設計
     - [ ] nat 落とす
       - [ ] アーキテクチャ図の修正
     - [ ] CI/CD
     - [ ] lambda insight
     - [ ] synthetics monitor
   - 内部品質
     - [ ] Migrater の応答がエラーになっている
     - [ ] テストの文言
     - [ ] テストしやすい docker compose 環境
     - [ ] https://www.npmjs.com/package/@vendia/serverless-express
     - [ ] `node_modules/.prisma` の monorepo 問題の解消
     - [ ] カバレッジ取る
   - 機能
     - [ ] done API
     - [ ] 変更履歴
     - [ ] 楽観ロック
     - [ ] init via Cognito Sign Up
