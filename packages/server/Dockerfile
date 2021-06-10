# mac M1 でデプロイする場合は以下を使う。
# Respect for https://qiita.com/96wver/items/873f017de6b65b4932fa
# FROM node:16-alpine@sha256:f5079a4f93c8e4fd07ffa93fc95f6484d7f4f40abd126c11810cb282483ab599
FROM node:16-alpine

WORKDIR /home/node/

ADD prisma prisma
ADD scripts scripts
ADD package.json .

RUN yarn

CMD ["yarn", "migrate-deploy-production"]
