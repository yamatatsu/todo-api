# API 仕様書

## 共通

### apiUrlBase

API Gateway の Stage のデフォルトに従ってください。

### jwtToken

認証のために cognito から払い出された JWT token を header に付与する必要があります。

```
x-ta-token:${jwt_token}
```

## GET `/user`

認証情報に紐づく User を返す。

### Request Example

```bash
curl -H "Content-Type: application/json" -H "x-ta-token:${jwtToken}" "${apiUrlBase}/user"
```

### Response Example

```json
{
  "id": 1391,
  "sub": "test-sub",
  "name": "test",
  "createdAt": "2021-06-22T14:24:02.069Z",
  "updatedAt": "2021-06-22T14:24:02.073Z",
  "boards": [
    {
      "id": 1239,
      "title": "Default",
      "description": null,
      "authorId": 1391,
      "createdAt": "2021-06-22T14:24:02.071Z",
      "updatedAt": "2021-06-22T14:24:02.073Z"
    }
  ]
}
```

## POST `/user`

認証情報に紐づく User を作成する。

### Body

| key  | type   | required |
| ---- | ------ | -------- |
| name | String | yes      |

### Request Example

```bash
curl -H "Content-Type: application/json" -H "x-ta-token:${jwtToken}" -X POST -d '{"name":"${name}"}' "${apiUrlBase}/user"
```

### Response Example

```json
{ "count": 1 }
```

## PUT `/user`

認証情報に紐づく User を更新する。

### Body

| key  | type   | required |
| ---- | ------ | -------- |
| name | String | yes      |

### Request Example

```bash
curl -H "Content-Type: application/json" -H "x-ta-token:${jwtToken}" -X PUT -d '{"name":"${name}"}' "${apiUrlBase}/user"
```

### Response Example

```json
{ "count": 1 }
```

## POST `/board`

Board を作成する。

### Body

| key         | type   | required |
| ----------- | ------ | -------- |
| title       | String | yes      |
| description | String | no       |

### Request Example

```bash
curl -H "Content-Type: application/json" -H "x-ta-token:${jwtToken}" -X POST -d '{"title":"${title}","description":"${description}"}' "${apiUrlBase}/board"
```

### Response Example

```json
{ "count": 1 }
```

## PUT `/board/:boardId`

Board を更新する。

### Body

| key         | type   | required |
| ----------- | ------ | -------- |
| title       | String | yes      |
| description | String | no       |

### Request Example

```bash
curl -H "Content-Type: application/json" -H "x-ta-token:${jwtToken}" -X PUT -d '{"title":"${title}","description":"${description}"}' "${apiUrlBase}/board/${boardId}"
```

### Response Example

```json
{ "count": 1 }
```

## DELETE `/board/:boardId`

Board を削除する。

### Request Example

```bash
curl -H "Content-Type: application/json" -H "x-ta-token:${jwtToken}" -X DELETE "${apiUrlBase}/board/${boardId}"
```

### Response Example

```json
{ "count": 1 }
```

## GET `/board/:boardId/tasks`

Task の一覧を取得する

### Query

| key     | type   | required |
| ------- | ------ | -------- |
| keyword | String | no       |

### Request Example

```bash
curl -H "Content-Type: application/json" -H "x-ta-token:${jwtToken}" -X GET "${apiUrlBase}/board/${boardId}/tasks?keyword=${keyword}"
```

### Response Example

```json
[
  {
    "id": 2067,
    "title": "Great Awesome Tutorial",
    "description": null,
    "finished": false,
    "boardId": 1282,
    "createdAt": "2021-06-22T14:32:52.113Z",
    "updatedAt": "2021-06-22T14:32:52.115Z"
  }
]
```

## POST `/board/:boardId/task`

Task を作成する

### Body

| key         | type   | required |
| ----------- | ------ | -------- |
| title       | String | yes      |
| description | String | no       |

### Request Example

```bash
curl -H "Content-Type: application/json" -H "x-ta-token:${jwtToken}" -X POST -d '{"title":"${title}","description":"${description}"}' "${apiUrlBase}/board/${boardId}/task"
```

### Response Example

```json
{ "count": 1 }
```

## PUT `/board/:boardId/task/:taskId`

Task を更新する

### Body

| key         | type   | required |
| ----------- | ------ | -------- |
| title       | String | yes      |
| description | String | no       |

### Request Example

```bash
curl -H "Content-Type: application/json" -H "x-ta-token:${jwtToken}" -X PUT -d '{"title":"${title}","description":"${description}"}' "${apiUrlBase}/board/${boardId}/task/${taskId}"
```

### Response Example

## DELETE `/board/:boardId/task/:taskId`

Task を削除する

### Request Example

```bash
curl -H "Content-Type: application/json" -H "x-ta-token:${jwtToken}" -X DELETE "${apiUrlBase}/board/${boardId}/task/${taskId}"
```

### Response Example

```json
{ "count": 1 }
```

## PUT `/board/:boardId/task/:taskId/finished`

Task を完了する

### Body

| key      | type    | required |
| -------- | ------- | -------- |
| finished | Boolean | yes      |

### Request Example

```bash
curl -H "Content-Type: application/json" -H "x-ta-token:${jwtToken}" -X PUT -d '{"finished":${finished}}' "${apiUrlBase}/board/${boardId}/task/${taskId}/finished"
```

### Response Example

```json
{ "count": 1 }
```
