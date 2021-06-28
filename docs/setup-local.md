# セットアップ

## 0. 準備

mysql を起動する。

```sh
docker run -d --name mariadb-server -e MARIADB_RANDOM_ROOT_PASSWORD=yes -e MYSQL_DATABASE=tadb -e MARIADB_USER=tauser -e MARIADB_PASSWORD=password -p 3306:3306 mariadb mysqld --character-set-server=utf8 --collation-server=utf8_unicode_ci
```

## 1. yarn install

```sh
yarn
```

> note: yarn berry を用いています。

## 2. .env file

```sh
cp packages/server/.env.example packages/server/.env
```

## 3. prisma migrate

```sh
cd packages/server
yarn prisma migrate deploy
```

### 4. prisma generate

```sh
yarn prisma generate
```

## 5. start server

```sh
cd packages/server
yarn start
```
