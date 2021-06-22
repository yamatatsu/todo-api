# インフラ構築

## 1. CDK Deploying

適切な IAM 権限を持って以下を実行する

```sh
yarn
cd packages/cdk
yarn cdk deploy --all
```

## 2. DB Migration

適切な IAM 権限を持って以下を実行する

```sh
aws lambda invoke --function-name development-TodoApi-Migrater-Fn /dev/stdout
```

## 3. 動作確認
