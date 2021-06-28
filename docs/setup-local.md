# セットアップ

## 1. .env file

```sh
cp packages/server/.env.example packages/server/.env
```

## 2. setup yarn and prisma

```sh
docker compose run --rm server yarn
docker compose run --rm server yarn prisma migrate deploy
docker compose run --rm server yarn prisma generate
```

## 3. up

```sh
docker compose up
```

### 4. test

```sh
docker compose run --rm server yarn test:large
```
