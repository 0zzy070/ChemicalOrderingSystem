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
            "userName": "admin",
            "password": "$2a$10$4rEUEA/mOQNbQqGYpX8rkuNXkopHBBl6QvkSCmbl0x2wpxcewoVBa",
            "authority": null,
            "email": "example@gmail.com"
        },
        {
            "userName": "user1",
            "password": "$2a$10$MmBCwBeONAHdw9L7fvB/PulibwxKNmU.iOcro1XAp1MaZoJQUK.qq",
            "authority": null,
            "email": "example@gmail.com"
        },
        {
            "userName": "exampleUser5",
            "password": "$2a$10$y92yXUiC2JaK0rRaWIZooOkd3SiOVoockxJeaAk/XFswCHHJUNgUe",
            "authority": "ROLE_ADMIN",
            "email": "example@gmail.com"
        },
        {
            "userName": "exampleUser6",
            "password": "$2a$10$sSekwft6gWzvPoIQa.kUOuTFZ7UAhzBNdE3AqJKL8d52vTzTX1q.e",
            "authority": "ROLE_USER",
            "email": "example@gmail.com"
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
    "msg": "User(s) found",
    "data": [
        {
            "userName": "exampleUser12",
            "password": "$2a$10$xSJD1smJBH4PoAVIs76ff.uBXkTwei/Ll0yklHDUQKBQ5pUAOKuSC",
            "authority": "ROLE_USER",
            "email": "test@gmail.com"
        }
    ]
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
    "userName": "exampleUser12",
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
        "id": "479c74f6-fe48-4502-aff0-375cae30b396",
        "username": "exampleUser12",
        "password": "$2a$10$xSJD1smJBH4PoAVIs76ff.uBXkTwei/Ll0yklHDUQKBQ5pUAOKuSC",
        "employeeNumber": "empyNo008",
        "createTime": 1725078875790,
        "updateTime": null,
        "enabled": true,
        "email": "test@gmail.com",
        "authority": {
            "id": "479c74f6-fe48-4502-aff0-375cae30b396",
            "username": "exampleUser12",
            "authority": "ROLE_USER"
        }
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

#  Status code table  
| Code Name    | Meaning | 
| --------- | ---- | 
| 200   | Success   |
| 500  | Inner Error  | 
| 400  | Invalid input provided |
| 403  | Authentication failed |  
| 404  | Data not exist |
| 600  | Operation not permitted|
