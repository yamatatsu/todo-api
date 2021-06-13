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

マネジメントコンソールを使って、AWS system manager session manager で Bastion サーバーに入る。

```sh
cd ~/

sudo yum update -y
sudo yum install git -y

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node
npm i -g yarn

git clone https://github.com/yamatatsu/todo-api.git
cd todo-api/

yarn

cd packages/server
echo 'DATABASE_URL="${ AuroraのURL }"' > .env

yarn prisma migrate deploy
```

## load map

1. architecture overview
   - [x] base of cdk
   - [x] deploy all resourse
   - [x] integration
   - [ ] db migration pipline
1. rest server on local
   - [x] setup prisma
     - https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch-typescript-postgres
     - https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database
     - https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
   - [ ] setup express
   - [ ] express on lambda
   - [ ] restful api
1. integration
   - [ ] e2e test
   - [ ] synthetics monitor
   - [ ] documentation
1. definition of done
   - [ ] design of architecture
   - [ ] documentation of design
   - [ ] implimentation
   - [ ] test code
   - [ ] playbook for launching application
1. 思いつき
   - 楽観ロック
   - done API
   - init via Cognito Sign Up
