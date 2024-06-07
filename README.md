# Unique store backend documentation
### Author: Israel Nanor


## TechStack
- Nodejs
- Typescript
- Mongodb with mongoose

## Run
npm run dev

## Test
npm run test

## User API Documentation
#### Register a user
- /users/register:
	* method: `post`
	* authentication: `not required`
	* body: 
		```javascript 
		{
			"name": string, 
			"email": string, 
			"password": string,
		}
		```
	* returns:
		```javascript 
		{
			"email": string
		}
		```
	* example:
		- request:

			`curl -X POST "localhost:8000/users/register" -H "Content-type: application/json" -d '{"name": "kingsley", "email": "king@gmail.com", "password": "juniorP@9"}'`

		- response:
			```javascript 
			{
				"email": "king@gmail.com"
			}
			```

#### Login a user
- /users/login:
	* method: `post`
	* authentication: `not required`
	* headers: `authorization: Basic base64(email:password)`
	* body: `blank`
	* returns:
		```javascript 
		{
			"accessToken": string, 
			"refreshToken": string, 
			"accessTokenExpires": string,
			"refreshTokenExpires": string
		}
		```
	* example:
		- request:  
			`curl -X POST "localhost:8000/users/login" -H "Content-type: application/json" -H "authorization: Basic a2luZ0BnbWFpbC5jb206anVuaW9yUEA5"`

		- response: 
			```javascript 
			{
				"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjYwZTJjZWI0MWY5MWY2N2E3ODQ2MGIiLCJpYXQiOjE3MTc2MjU1NTMuNTc3LCJleHAiOjE3MTc2MjU4NTMuNTY0LCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.sGK1A6ucE9kR9Qj8g2H2y20tRmARWadhXVqsxKTPT6M",
				"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjYwZTJjZWI0MWY5MWY2N2E3ODQ2MGIiLCJpYXQiOjE3MTc2MjU1NTMuNTkyLCJleHAiOjE3MTc3MTE5NTMuNTkyLCJ0eXBlIjoicmVmcmVzaF90b2tlbiJ9.-EtVSbL-0r--PZB9FWlTQ6bXEgE0xQ-FSv0VJMnIgco",
				"accessTokenExpires":"Wed, 05 Jun 2024 22:17:33 GMT",
				"refreshTokenExpires":"Thu, 06 Jun 2024 22:12:33 GMT"
			}
			```

#### Request refresh token
- /users/token:
	* method: `post`
	* authentication: `not required`
	* headers: `authorization: JWT {refresh token}`
	* body: 
		```javascript 
		{ 
			"accessToken": string,
		}
		```
	* returns: 
		```javascript 
		{
			"accessToken": string, 
			"refreshToken": string, 
			"accessTokenExpires": string,
			"refreshTokenExpires": string
		}
		```
	* example:
		- request:  
			`curl -X POST "localhost:8000/users/login" -H "Content-type: application/json" -H "authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjYwZTJjZWI0MWY5MWY2N2E3ODQ2MGIiLCJpYXQiOjE3MTc2MjU1NTMuNTkyLCJleHAiOjE3MTc3MTE5NTMuNTkyLCJ0eXBlIjoicmVmcmVzaF90b2tlbiJ9.-EtVSbL-0r--PZB9FWlTQ6bXEgE0xQ-FSv0VJMnIgco"`

		- response: 
			```javascript 
			{
				"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjYwZTJjZWI0MWY5MWY2N2E3ODQ2MGIiLCJpYXQiOjE3MTc2MjU1NTMuNTc3LCJleHAiOjE3MTc2MjU4NTMuNTY0LCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.sGK1A6ucE9kR9Qj8g2H2y20tRmARWadhXVqsxKTPT6M",
				"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjYwZTJjZWI0MWY5MWY2N2E3ODQ2MGIiLCJpYXQiOjE3MTc2MjU1NTMuNTkyLCJleHAiOjE3MTc3MTE5NTMuNTkyLCJ0eXBlIjoicmVmcmVzaF90b2tlbiJ9.-EtVSbL-0r--PZB9FWlTQ6bXEgE0xQ-FSv0VJMnIgco",
				"accessTokenExpires":"Wed, 05 Jun 2024 22:17:33 GMT",
				"refreshTokenExpires":"Thu, 06 Jun 2024 22:12:33 GMT"
			}
			```
#### Get all users
- /users:
	* method: `get`
	* authentication: `required`
	* body: `blank`
	* route params: `page and limit`
	* example:
		- request:  
			`curl -X GET "localhost:8000/users?page=1&limit=20" -H "Content-type: application/json"`

		- response: 
			```javascript 
			{
				"page": 1,
				"limit": 10,
				"total": 2,
				"pages": 1,
				"data": [
					{
						"_id": "666263892789061b37756b19",
						"name": "testUser",
						"email": "testuser@gmil.com",
						"password": "$2a$09$cXlJPaKOFW0RkJqHoH1NNexEwPa3mXb8uu8ndClEXtz0ImyaEn8Um",
						"created_at": "2024-06-07T01:34:01.271Z",
						"__v": 0
					},
					{
						"_id": "666264622789061b37756b26",
						"name": "carpenter",
						"email": "testuser1@gmil.com",
						"password": "$2a$09$B4ohAt5.QzeE8lc4SkMVpudvE06SvPf9JJ04Oy0DP39YaKing2b6G",
						"created_at": "2024-06-07T01:37:38.525Z",
						"__v": 0
					}
				]
			}
			```
