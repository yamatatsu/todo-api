# シミュレーターの使い方

シミュレーターというか jwt 取得機というか。

1. CDK によって作成された Cognito UserPool の `UserPool ID`, `UserPool Client ID` を確認する
1. `packages/simulator/.env` を作成し 1 を設定する。
1. `yarn start` で simulator を立ち上げる。
1. アカウント作成をしてログインする
1. `JWT Token Copy` ボタンを押すとクリップボードに jwt がコピーされる
