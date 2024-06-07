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
						"created_at": "2024-06-07T01:34:01.271Z",
						"__v": 0
					},
					{
						"_id": "666264622789061b37756b26",
						"name": "carpenter",
						"email": "testuser1@gmil.com",
						"created_at": "2024-06-07T01:37:38.525Z",
						"__v": 0
					}
				]
			}
			```
#### Get a user by id
- /users/:id:
	* method: `get`
	* authentication: `required`
	* body: `blank`
	* route params: `user id`
	* example:
		- request:  
			`curl -X GET "localhost:8000/users/6662f0a10169005292883001" -H "Content-type: application/json"`

		- response: 
			```javascript 
			{
				"_id": "6662f0a10169005292883001",
				"name": "testUser",
				"email": "testuser@gmil.com",
				"created_at": "2024-06-07T01:34:01.271Z",
				"__v": 0
			}
			```

#### Update a user by id
- /users/:id:
	* method: `put`
	* authentication: `required`
	* body: `{name: string}`
	* route params: `user id`
	* example:
		- request:  
			`curl -X PUT "localhost:8000/users/6662f0a10169005292883001" -H "Content-type: application/json" -d '{"name": "Jane Doe"}'`

		- response: 
			```javascript 
				{
					
					"_id": "66632ef4f8607d85c5076835",
					"name": "Clottey",
					"email": "testuser1@gmil.com",
					"password": "$2a$09$RItdVqcV4w7ewSlwo4zMxuEGmve/QKz7pdvvssbOE49LPKwxd/.Vi",
					"created_at": "2024-06-07T16:01:56.540Z",
					"__v": 0

				}
			```


#### Delete a user by id
- /users/:id:
	* method: `delete`
	* authentication: `required`
	* body: `blank`
	* route params: `none`
	* example:
		- request:  
			`curl -X DELETE "localhost:8000/users" -H "Content-type: application/json"`

		- response: 
			```javascript 
				{
					
					"_id": "66632ef4f8607d85c5076835",
					"name": "Clottey",
					"email": "testuser1@gmil.com",
					"password": "$2a$09$RItdVqcV4w7ewSlwo4zMxuEGmve/QKz7pdvvssbOE49LPKwxd/.Vi",
					"created_at": "2024-06-07T16:01:56.540Z",
					"__v": 0

				}
			```



## Product API Documentation
#### Get all products
- /products:
	* method: `get`
	* authentication: `not required`
	* body: `blank`
	* route params: `none`
	* example:
		- request:  
			`curl -X GET "localhost:8000/products" -H "Content-type: application/json"`

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
						"stock": 5,
						"price": 99.90,
						"created_at": "2024-06-07T01:34:01.271Z",
						"__v": 0
					},
					{
						"_id": "666263892789061b37756b20",
						"stock": 25,
						"price": 99.90,
						"created_at": "2024-06-07T01:34:01.271Z",
						"__v": 0
					}
				]
			}
			```

#### Get a product by id
- /products/:id:
	* method: `get`
	* authentication: `required`
	* body: `blank`
	* route params: `product id`
	* example:
		- request:  
			`curl -X GET "localhost:8000/products/666263892789061b37756b19" -H "Content-type: application/json"`

		- response: 
			```javascript 
			{

				"_id": "666263892789061b37756b19",
				"stock": 5,
				"price": 99.90,
				"created_at": "2024-06-07T01:34:01.271Z",
				"__v": 0
			}
			```

## Orders API Documentation
#### Get all orders
- /orders:
	* method: `get`
	* authentication: `required`
	* body: `blank`
	* route params: `none`
	* example:
		- request:  
			`curl -X GET "localhost:8000/orders" -H "Content-type: application/json"`

		- response: 
			```javascript 
			{
				"page": 1,
				"limit": 10,
				"total": 2,
				"pages": 1,
				"data": [
					{
						products: [ '66631fff03f63e85d2e4636b' ],
						user_id: '66631fff03f63e85d2e46355',
						_id: '66631fff03f63e85d2e46366',
						created_at: '2024-06-07T14:58:07.708Z',
						updated_at: '2024-06-07T14:58:07.708Z',
						__v: 1
					}
				]
			}
			```
#### Get a order by id
- /orders/:id:
	* method: `get`
	* authentication: `required`
	* body: `blank`
	* route params: `product id`
	* example:
		- request:  
			`curl -X GET "localhost:8000/orders/66632f09f8607d85c507683b" -H "Content-type: application/json"`

		- response: 
			```javascript 
			{
				"_id": "66632f09f8607d85c507683b",
				"products": [
					"66632f09f8607d85c507683e"
				],
				"user_id": "66632ef4f8607d85c5076835",
				"created_at": "2024-06-07T16:02:17.886Z",
				"updated_at": "2024-06-07T16:02:17.886Z",
				"__v": 1
			}
			```

#### Get all orders for a specific user
- /orders/user/:id:
	* method: `get`
	* authentication: `required`
	* body: `blank`
	* route params: `user id`
	* example:
		- request:  
			`curl -X GET "localhost:8000/orders/user/66632ef4f8607d85c5076835" -H "Content-type: application/json"`

		- response: 
			```javascript 
				{
					"page": 1,
					"limit": 10,
					"total": 17,
					"pages": 2,
					"data": [
						{
							"_id": "66632f09f8607d85c507683b",
							"products": [
								"66632f09f8607d85c507683e"
							],
							"user_id": "66632ef4f8607d85c5076835",
							"created_at": "2024-06-07T16:02:17.886Z",
							"updated_at": "2024-06-07T16:02:17.886Z",
							"__v": 1
						},
						{
							"_id": "6663365c2ddeb9446a712659",
							"products": [
								"6663365c2ddeb9446a71265c"
							],
							"user_id": "66632ef4f8607d85c5076835",
							"created_at": "2024-06-07T16:33:32.830Z",
							"updated_at": "2024-06-07T16:33:32.830Z",
							"__v": 1
						}
					]
			}
			```

#### Get all products for a specific order
- /orders/user/:id:
	* method: `get`
	* authentication: `required`
	* body: `blank`
	* route params: `order id`
	* example:
		- request:  
			`curl -X GET "localhost:8000/orders/66632ef4f8607d85c5076835/products" -H "Content-type: application/json"`

		- response: 
			```javascript 
			[
				{
					"_id": "66632e01a5e2c70a79e51886",
					"name": "test product",
					"stock": 5,
					"price": 90.99,
					"createdAt": "2024-06-07T15:57:53.147Z",
					"__v": 0
				}
			]
			```