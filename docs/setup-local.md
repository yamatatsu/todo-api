# セットアップ

## 0. 準備

- mysql が起動している。
- mysql にデータベースとユーザーが作成されている。

## 1. yarn install

```sh
yarn
```

> note: yarn berry を用いています。

## 2. .env file

```sh
cp packages/server/.env.example packages/server/.env
```

以下の URL を参考に、 `DATABASE_URL=""` を設定する。
https://www.prisma.io/docs/concepts/database-connectors/mysql#connection-url

## 3. prisma migrate

```sh
cd packages/server
yarn prisma migrate deploy
```

## 4. start server

```sh
cd packages/server
yarn start
```
