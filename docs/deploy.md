# デプロイ

## 1. サーバーコードのデプロイ

適切な IAM 権限を持って以下を実行する

```sh
yarn cdk deploy development-TodoApi-ApiServer
```

## 2. Migration Lambda のデプロイ

適切な IAM 権限を持って以下を実行する

```sh
yarn cdk deploy development-TodoApi-Migrater
```

デプロイできたら lambda を実行して DB Migration をする

```sh
aws lambda invoke --function-name development-TodoApi-Migrater-Fn /dev/stdout
```
