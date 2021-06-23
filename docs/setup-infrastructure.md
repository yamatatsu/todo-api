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

1. API Gateway の Stage の URL を確認する
1. 1 の URL を使い、以下を実行し、`{"message":"Unauthorized"}`が返ってくることを確認する。  
   `curl -H "Content-Type: application/json" -X GET ${URL}/`
1. [シミュレーターを使って](./using-simulator.md) JWT Token を取得する
1. 1,3 を使って以下を実行し `OK.` が返ってくることを確認する。
   `curl -H "Content-Type: application/json" -H "x-ta-token:${jwtToken}" -X GET ${URL}/`
1. 1,3 を使って以下を実行し `Not Found` が返ってくることを確認する。
   `curl -H "Content-Type: application/json" -H "x-ta-token:${jwtToken}" -X GET ${URL}/user`
1. 1,3 を使って以下を実行し `{"count":1}` が返ってくることを確認する。
   `curl -H "Content-Type: application/json" -H "x-ta-token:${jwtToken}" -X POST -d '{"name":"test-user"}' ${URL}/user`
1. 1,3 を使って以下を実行し ユーザー情報が返ってくることを確認する。
   `curl -H "Content-Type: application/json" -H "x-ta-token:${jwtToken}" -X GET ${URL}/user`
