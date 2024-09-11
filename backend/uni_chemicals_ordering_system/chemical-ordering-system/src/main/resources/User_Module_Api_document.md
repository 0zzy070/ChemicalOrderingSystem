## LOCATION MODULE API


​    

# 1 User Login  


### Interface Description  

 `Authenticate a user and generate a JWT token.`  

### Interface Url  

`POST /api/users/login`  

### Method  

 `POST`  

### Request Parameter  

| Parameter Name    | Required | Type   | Limitation Factor        | Desc     |
| --------- | ---- | ------ | --------------- | -------- |



### Header Parameter  

| Parameter Name      | Required| Type/Value      | Desc         |
| ------------ | ---- | ---------------- | ------------ |
| Token | yes   | string | JWT token for authentication |

### Body Parameter  

| Parameter Name      | Required| Type/Value      |  Limitation Factor |     Desc         |
| --------- | ---- | ------ | --------------- | -------- |
| userName | yes | string| 1 < length < 64 |Username of the user|
| password | yes   | string | 1 < length < 64 | Password of the user |


### Reuqest Example

```json
{
  "userName": "john_doe",
  "password": "password123"
}
```

### 6 Return Example  

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "token": "jwt-token-string",
    "username": "john_doe",
    "roles": ["ROLE_USER"]
  }
}

```



# 2 Get All Users  


### Interface Description  

 `Retrieve a list of all users.`  

### Interface Url  

`GET /api/users`  

### Method  

 `POST`  


### Header Parameter  

| Parameter Name      | Required| Type/Value      | Desc         |
| ------------ | ---- | ---------------- | ------------ |
| Token | yes   | string | token for authentication |

### Body Parameter  

| Parameter Name      | Required| Type/Value      |  Limitation Factor |     Desc         |
| --------- | ---- | ------ | --------------- | -------- |



### Reuqest Example
http://localhost:8080/api/organizational-units/deleteById/99a96818-9763-42e9-83dc-ec24031a2b97


### 6 Return Example  

```json
{
    "code": 200,
    "msg": "Success",
    "data": [
        {
            "id": "73da378b-da43-4ccb-a689-74cc8e58788q",
            "username": "admin",
            "password": "$2a$10$4rEUEA/mOQNbQqGYpX8rkuNXkopHBBl6QvkSCmbl0x2wpxcewoVBa",
            "employeeNumber": "empyNo001",
            "createTime": null,
            "updateTime": null,
            "enabled": true,
            "email": "example@gmail.com"
        },
        {
            "id": "73da378b-da43-4ccb-a689-74cc8e587881",
            "username": "user1",
            "password": "$2a$10$MmBCwBeONAHdw9L7fvB/PulibwxKNmU.iOcro1XAp1MaZoJQUK.qq",
            "employeeNumber": "employNo002",
            "createTime": null,
            "updateTime": null,
            "enabled": true,
            "email": "example@gmail.com"
        },
        {
            "id": "bf268990-8da3-43f4-b7a8-c74227085957",
            "username": "exampleUser5",
            "password": "$2a$10$y92yXUiC2JaK0rRaWIZooOkd3SiOVoockxJeaAk/XFswCHHJUNgUe",
            "employeeNumber": "empyNo005",
            "createTime": 1724124415118,
            "updateTime": null,
            "enabled": true,
            "email": "example@gmail.com"
        },
        {
            "id": "b3570ff5-3157-4bc7-8a53-208774c3758f",
            "username": "exampleUser6",
            "password": "$2a$10$sSekwft6gWzvPoIQa.kUOuTFZ7UAhzBNdE3AqJKL8d52vTzTX1q.e",
            "employeeNumber": "empyNo006",
            "createTime": 1724125207922,
            "updateTime": null,
            "enabled": true,
            "email": "example@gmail.com"
        },
        {
            "id": "70cfcd47-5265-4d73-b7d8-0e983e921798",
            "username": "exampleUser10",
            "password": "$2a$10$qAOp.ZoozM9Aqy3aYPv2hOTZ0Fg2nYzE/FFBBReYEeeRmo9D8Dn52",
            "employeeNumber": "empyNo007",
            "createTime": 1725070248969,
            "updateTime": null,
            "enabled": true,
            "email": "test@gmail.com"
        },
        {
            "id": "c389e46e-4610-4ed2-a371-7b60cba1935a",
            "username": "exampleUser11",
            "password": "$2a$10$GaJ9Xh459jxDKGN2ZUCUze7DBrBvq09YsXIRUrIBpEy3pL8VnCMVq",
            "employeeNumber": "empyNo008",
            "createTime": 1725070281837,
            "updateTime": null,
            "enabled": true,
            "email": "test@gmail.com"
        }
    ]
}
```

# 3 Get User By ID  


### Interface Description  

 `Retrieve a user by their ID.`  

### Interface Url  

`GET /api/users/{id}`  

### Method  

 `GET`  

### Header Parameter  

| Parameter Name | Required | Type   | Desc                         |
| -------------- | -------- | ------ | ---------------------------- |
| Token          | yes      | string | JWT token for authentication |


### Path Parameter  

| Parameter Name | Required | Type   | Limitation Factor | Desc           |
| -------------- | -------- | ------ | ----------------- | -------------- |
| id             | yes      | string | 1 < length < 64   | ID of the user |



### Reuqest Example

http://localhost:8080/api/users/bf268990-8da3-43f4-b7a8-c74227085957


### 6 Return Example  

```json
{
    "code": 200,
    "msg": "Success",
    "data": {
        "id": "70cfcd47-5265-4d73-b7d8-0e983e921798",
        "username": "exampleUser10",
        "password": "$2a$10$qAOp.ZoozM9Aqy3aYPv2hOTZ0Fg2nYzE/FFBBReYEeeRmo9D8Dn52",
        "employeeNumber": "empyNo007",
        "createTime": 1725070248969,
        "updateTime": null,
        "enabled": true,
        "email": "test@gmail.com"
    }
}
```

### 6 Error Response  

```json
{
    "code": 404,
    "msg": "User not found",
    "data": null
}
```

# 4 Create User  


### Interface Description  

 `Create a new user in the system. Only users with the ADMIN role can access this endpoint.`  

### Interface Url  

`POST /api/users`  

### Method  

 `POST`  

### Authorization Requirements

This endpoint requires the user to have an ADMIN role.

### Request Parameter  


### Header Parameter  

| Parameter Name      | Required| Type/Value      | Desc         |
| ------------ | ---- | ---------------- | ------------ |
| Token | yes   | string | token for authentication |

### Body Parameter  

| Parameter Name      | Required| Type/Value      |  Limitation Factor |     Desc         |
| --------- | ---- | ------ | --------------- | -------- |
| userName | yes | string | 1 < length < 64 | Username of the new user |
| password | yes | string | 1 < length < 64 | Password of the new user |
| authority | yes | string | 1 < length < 64 | Authorities assigned to the user |



### Reuqest Example
http://localhost:8080/api/organizational-units/listByOrgType/-1


### 6 Return Example  
```json
{
    "userName": "exampleUser11",
    "password": "examplePassword",
    "authority": "ROLE_USER",
    "email":"test@gmail.com"
}
```

### 6 Return Example 
```json
{
    "code": 200,
    "msg": "success",
    "data": {
        "id": "c389e46e-4610-4ed2-a371-7b60cba1935a",
        "username": "exampleUser11",
        "password": "$2a$10$GaJ9Xh459jxDKGN2ZUCUze7DBrBvq09YsXIRUrIBpEy3pL8VnCMVq",
        "employeeNumber": "empyNo008",
        "createTime": 1725070281837,
        "updateTime": null,
        "enabled": true,
        "email": "test@gmail.com"
    }
}
```



# 6 Delete User By ID


### Interface Description  

 `Delete a user by their ID.`  

### Interface Url  

`DELETE /api/users/{id}`  

### Method  

 `DELETE`  

### Request Parameter  

| Parameter Name    | Required | Type   | Limitation Factor        | Desc     |
| --------- | ---- | ------ | --------------- | -------- |



### Header Parameter  

| Parameter Name      | Required| Type/Value      | Desc         |
| ------------ | ---- | ---------------- | ------------ |
| Token | yes   | string | token for authentication |

### Path Parameters  

| Parameter Name      | Required| Type/Value      | Limitation Factor | Desc         |
| ------------ | ---- | ---------------- | ------------ | ------------ |
| id | yes   | string | 1 < length < 64 | ID of the user |


### 6 Return Example  

```json
{
    "code": 200,
    "msg": "User deleted successfully",
    "data": null
}
```
### 6 Error Response  

```json
{
    "code": 404,
    "msg": "User not found",
    "data": null
}
```
# 7 Get User By Employee Number

### Interface Description  

`Retrieve user(s) based on their employee number.`  

### Interface Url  

`GET /api/users/employee/{employeeNumber}`  

### Method  

`GET`  

### Request Parameter  

| Parameter Name    | Required | Type   | Limitation Factor | Desc                        |
| ----------------- | -------- | ------ | ----------------- | --------------------------- |
|                   |          |        |                   |                             |

### Header Parameter  

| Parameter Name | Required | Type/Value | Desc                           |
| -------------- | -------- | ---------- | ------------------------------ |
| Token          | yes      | string     | token for authentication       |

### Path Parameters  

| Parameter Name    | Required | Type/Value | Limitation Factor | Desc                    |
| ----------------- | -------- | ---------- | ----------------- | ----------------------- |
| employeeNumber    | yes      | string     | 1 < length < 32   | Employee number of user |

Reuqest Examples

http://localhost:8080/api/users/employee/empyNo010

### Return Example  

```json
{
    "code": 200,
    "msg": "User(s) found",
    "data": [
        {
            "id": "50f97bb3-8521-4e45-a0c4-eccd494dd0ac",
            "userName": "ada",
            "password": "$2a$10$HKwxetZrO./WDmT/MfUVL.loO9Bewl1olD3GXafdar4Fxvy0IPRvy",
            "authority": "zcc",
            "email": "zhou0671@flinders.du.au",
            "employeeNumber": "empyNo010"
        }
    ]
}
```


#  Status code table  
| Code Name    | Meaning | 
| --------- | ---- | 
| 200   | Success   |
| 500  | Inner Error  | 
| 400  | Invalid input provided |
| 403  | Authentication failed |  
| 404  | Data not exist |
| 600  | Operation not permitted|
