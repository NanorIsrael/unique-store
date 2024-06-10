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

## Note:
- User roles have been seperated from admin roles.
to creat admin check user api docs for details.
- envs can be found in the env.txt file


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
#### Get all users
- /users:
	* method: `get`
	* authentication: `required (admin)`
	* body: `blank`
	* route params: `page and limit`
	* example:
		- request:  
			`curl -X GET "localhost:8000/users?page=1&limit=20" -H "Content-type: application/json" -H "authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjY3Mjc2ZDFiODY2Y2YwODYwNGVmNjIiLCJpYXQiOjE3MTgwMzcxODMuNzc4LCJleHAiOjE3MTgwMzg5ODMuNzc4LCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.1PNlgTqnRuI8hsnp3wxyh8FtIl1hbgv0MWJolyPC7m8"`

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
			`curl -X GET "localhost:8000/users/666725a5190f82545738d1fd" -H "Content-type: application/json" -H "authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjY3Mjc2ZDFiODY2Y2YwODYwNGVmNjIiLCJpYXQiOjE3MTgwMzcxODMuNzc4LCJleHAiOjE3MTgwMzg5ODMuNzc4LCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.1PNlgTqnRuI8hsnp3wxyh8FtIl1hbgv0MWJolyPC7m8"`

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
			`curl -X PUT "localhost:8000/users/666725a5190f82545738d1fd" -H "Content-type: application/json" -d '{"name": "Jane Doe"}' -H "authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjY3Mjc2ZDFiODY2Y2YwODYwNGVmNjIiLCJpYXQiOjE3MTgwMzcxODMuNzc4LCJleHAiOjE3MTgwMzg5ODMuNzc4LCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.1PNlgTqnRuI8hsnp3wxyh8FtIl1hbgv0MWJolyPC7m8"`

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
			`curl -X DELETE "localhost:8000/users/666725a5190f82545738d1fd" -H "Content-type: application/json" -H "authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjY3Mjc2ZDFiODY2Y2YwODYwNGVmNjIiLCJpYXQiOjE3MTgwMzcxODMuNzc4LCJleHAiOjE3MTgwMzg5ODMuNzc4LCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.1PNlgTqnRuI8hsnp3wxyh8FtIl1hbgv0MWJolyPC7m8"`

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
#### Create admin user
- /users/admin:
	* method: `post`
	* authentication: `required`
	* body: 
	```javascript
		{
			email: string
		}	
	```
	* route params: `none`
	* example:
		- request:  
			`curl -X POST "localhost:8000/users/admin" -H "Content-type: application/json" -H "authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjY3Mjc2ZDFiODY2Y2YwODYwNGVmNjIiLCJpYXQiOjE3MTgwMzcxODMuNzc4LCJleHAiOjE3MTgwMzg5ODMuNzc4LCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.1PNlgTqnRuI8hsnp3wxyh8FtIl1hbgv0MWJolyPC7m8" -d '{"email": "king@gmail.com"}'`

		- response: 
			```javascript 
				{
					"_id": "66632ef4f8607d85c5076835",
					"user_id":"6667025234c463b810e7af31",
					"created_at": "2024-06-07T16:01:56.540Z",
					"createdAt":"2024-06-10T13:43:14.358Z","updatedAt":"2024-06-10T13:43:14.358Z",
					"__v":0
				}
			```



## Product API Documentation
#### Create new product
- /products:
	* method: `post`
	* authentication: `required`
	* body:
	```javascript
		{
			name: "coke";
			stock: 6;
			price: 2.80;
		}
	````
	* route params: `none`
	* example:
		- request:  
			`curl -X POST "localhost:8000/products" -H "Content-type: application/json" -d '{"name": "coke", "stock": 6, "price": 2.00}' -H "authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjY3Mjc2ZDFiODY2Y2YwODYwNGVmNjIiLCJpYXQiOjE3MTgwMzcxODMuNzc4LCJleHAiOjE3MTgwMzg5ODMuNzc4LCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.1PNlgTqnRuI8hsnp3wxyh8FtIl1hbgv0MWJolyPC7m8"`

		- response: 
			```javascript 
			{
				"name":"coke",
				"stock":6,
				"price":2,
				"_id":"666372e055664f6a0a45cb4c",
				"createdAt":"2024-06-07T20:51:44.298Z","__v":0
			}
			```
#### Get all products
- /products:
	* method: `get`
	* authentication: `not required`
	* body: `blank`
	* route params: `none`
	* example:
		- request:  
			`curl -X GET "localhost:8000/products" -H "Content-type: application/json" -H "authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjY3Mjc2ZDFiODY2Y2YwODYwNGVmNjIiLCJpYXQiOjE3MTgwMzcxODMuNzc4LCJleHAiOjE3MTgwMzg5ODMuNzc4LCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.1PNlgTqnRuI8hsnp3wxyh8FtIl1hbgv0MWJolyPC7m8"`

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
			`curl -X GET "localhost:8000/products/66672c001b866cf08604ef83" -H "Content-type: application/json" -H "authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjY3Mjc2ZDFiODY2Y2YwODYwNGVmNjIiLCJpYXQiOjE3MTgwMzcxODMuNzc4LCJleHAiOjE3MTgwMzg5ODMuNzc4LCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.1PNlgTqnRuI8hsnp3wxyh8FtIl1hbgv0MWJolyPC7m8"`

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

#### Update a product
- /products/:id:
	* method: `put`
	* authentication: `required`
	* body: `blank`
	* route params: `product id`
	* example:
		- request:  
			`curl -X PUT "localhost:8000/products/66672c001b866cf08604ef83" -H "Content-type: application/json" -d '{"name": "coke", "stock": 6, "price": 2.00}' -H "authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjY3Mjc2ZDFiODY2Y2YwODYwNGVmNjIiLCJpYXQiOjE3MTgwMzcxODMuNzc4LCJleHAiOjE3MTgwMzg5ODMuNzc4LCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.1PNlgTqnRuI8hsnp3wxyh8FtIl1hbgv0MWJolyPC7m8" `

		- response: 
			```javascript 
			{
				"_id": "66632e01a5e2c70a79e51886",
				"name": "updated product",
				"stock": 5,
				"price": 90.99,
				"createdAt": "2024-06-07T15:57:53.147Z",
				"__v": 0
			}
			```
#### Delete product
- /products/:id:
	* method: `delete`
	* authentication: `required`
	* body: `blank`
	* route params: `product id`
	* example:
		- request:  
			`curl -X DELETE "localhost:8000/products/66672c001b866cf08604ef83" -H "Content-type: application/json" -H "authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjY3Mjc2ZDFiODY2Y2YwODYwNGVmNjIiLCJpYXQiOjE3MTgwMzcxODMuNzc4LCJleHAiOjE3MTgwMzg5ODMuNzc4LCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.1PNlgTqnRuI8hsnp3wxyh8FtIl1hbgv0MWJolyPC7m8" `

		- response: 
			```javascript 
			{
				"_id": "66632e01a5e2c70a79e51886",
				"name": "updated product",
				"stock": 5,
				"price": 90.99,
				"createdAt": "2024-06-07T15:57:53.147Z",
				"__v": 0
			}
			```

#### minimum product
- /products/stock:
	* method: `get`
	* authentication: `required (admin)`
	* body: `blank`
	* route params: `limit: number, page: number, minimum(stock)`
	* example:
		- request:  
			`curl -X GET "localhost:8000/products/stock" -H "Content-type: application/json" -H "authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjY3Mjc2ZDFiODY2Y2YwODYwNGVmNjIiLCJpYXQiOjE3MTgwMzcxODMuNzc4LCJleHAiOjE3MTgwMzg5ODMuNzc4LCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.1PNlgTqnRuI8hsnp3wxyh8FtIl1hbgv0MWJolyPC7m8" `

		- response: 
			```javascript 
			[{
				"_id": "66632e01a5e2c70a79e51886",
				"name": "updated product",
				"stock": 5,
				"price": 90.99,
				"createdAt": "2024-06-07T15:57:53.147Z",
				"__v": 0
			}]
			```

## Orders API Documentation
#### Create new product
- /products:
	* method: `post`
	* authentication: `required`
	* body:
	```javascript
		{
			"productLine": [
				{
					"id": "666511fa39b213f3838d9654",
					"productId": "66632e01a5e2c70a79e51890",
					"quantity": 9
				}
			]
		}
	````
	* route params: `none`
	* example:
		- request:  
			`curl -X POST "localhost:8000/orders" -H "Content-type: application/json" -d '{ "productLine": [{"productId": "66672f311b866cf08604ef99", "quantity": 9}]}' -H "authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjY3Mjc2ZDFiODY2Y2YwODYwNGVmNjIiLCJpYXQiOjE3MTgwMzcxODMuNzc4LCJleHAiOjE3MTgwMzg5ODMuNzc4LCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.1PNlgTqnRuI8hsnp3wxyh8FtIl1hbgv0MWJolyPC7m8"`

		- response: 
			```javascript 
			{
				"name":"coke",
				"stock":6,
				"price":2,
				"_id":"666372e055664f6a0a45cb4c",
				"createdAt":"2024-06-07T20:51:44.298Z","__v":0
			}
			```

#### Get all orders
- /orders:
	* method: `get`
	* authentication: `required`
	* body: `blank`
	* route params: `none`
	* example:
		- request:  
			`curl -X GET "localhost:8000/orders" -H "Content-type: application/json" -H "authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjY3Mjc2ZDFiODY2Y2YwODYwNGVmNjIiLCJpYXQiOjE3MTgwMzcxODMuNzc4LCJleHAiOjE3MTgwMzg5ODMuNzc4LCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.1PNlgTqnRuI8hsnp3wxyh8FtIl1hbgv0MWJolyPC7m8"`

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
			`curl -X GET "localhost:8000/orders/66672f871b866cf08604efa1" -H "Content-type: application/json" -H "authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjY3Mjc2ZDFiODY2Y2YwODYwNGVmNjIiLCJpYXQiOjE3MTgwMzcxODMuNzc4LCJleHAiOjE3MTgwMzg5ODMuNzc4LCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.1PNlgTqnRuI8hsnp3wxyh8FtIl1hbgv0MWJolyPC7m8"`

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
			`curl -X GET "localhost:8000/orders/user/66672f871b866cf08604efa1" -H "Content-type: application/json" -H "authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjY3Mjc2ZDFiODY2Y2YwODYwNGVmNjIiLCJpYXQiOjE3MTgwMzcxODMuNzc4LCJleHAiOjE3MTgwMzg5ODMuNzc4LCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.1PNlgTqnRuI8hsnp3wxyh8FtIl1hbgv0MWJolyPC7m8"`

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
- /orders/:id/products:
	* method: `get`
	* authentication: `required`
	* body: `blank`
	* route params: `order id`
	* example:
		- request:  
			`curl -X GET "localhost:8000/orders/66672f871b866cf08604efa1/products" -H "Content-type: application/json" -H "authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjY3Mjc2ZDFiODY2Y2YwODYwNGVmNjIiLCJpYXQiOjE3MTgwMzcxODMuNzc4LCJleHAiOjE3MTgwMzg5ODMuNzc4LCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.1PNlgTqnRuI8hsnp3wxyh8FtIl1hbgv0MWJolyPC7m8"`

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

#### Update a specific order
- /orders/:id:
	* method: `put`
	* authentication: `required`
	* body:
		```javascript
		{
			"productLine": [
				
				{
					"id": "product line id",
					"productId": "product id",
					"quantity": "product quantity"
				}
				
			]
		}
		```
	* route params: `order id`
	* example:
		- request:  
			`curl -X PUT "localhost:8000/orders/66672f871b866cf08604efa1" -H "Content-type: application/json" -H "authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjY3Mjc2ZDFiODY2Y2YwODYwNGVmNjIiLCJpYXQiOjE3MTgwMzcxODMuNzc4LCJleHAiOjE3MTgwMzg5ODMuNzc4LCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.1PNlgTqnRuI8hsnp3wxyh8FtIl1hbgv0MWJolyPC7m8" -d '{ "productLine": [{id:"66672f871b866cf08604efa4", productId": "66672f311b866cf08604ef99", "quantity": 19}]}'`

		- response: 
			```javascript 
			[
				{
					"_id": "66652615ad45463b97eb1676",
					"products": [
						"6665263dad45463b97eb1680"
					],
					"user_id": "66632ef4f8607d85c5076835",
					"created_at": "2024-06-09T03:48:37.879Z",
					"updated_at": "2024-06-09T03:48:37.879Z",
					"__v": 2
				}
			]
			```

#### Update a specific order
- /orders/:id:
	* method: `delete`
	* authentication: `required`
	* body: `blank`
	* route params: `order id`
	* example:
		- request:  
			`curl -X DELETE "localhost:8000/orders/66632ef4f8607d85c5076835" -H "Content-type: application/json" -H "authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NjYzMmVmNGY4NjA3ZDg1YzUwNzY4MzUiLCJpYXQiOjE3MTc3ODYzOTEuNTI2LCJleHAiOjE3MTc3ODY2OTEuNTEzLCJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.RD7HS6xREhtTUpb-zj4oKkQ1D8hnr_HR09RopKY6knc"`

		- response: 
			```javascript 
				{
					"_id": "66652615ad45463b97eb1676",
					"products": [
						"6665263dad45463b97eb1680"
					],
					"user_id": "66632ef4f8607d85c5076835",
					"created_at": "2024-06-09T03:48:37.879Z",
					"updated_at": "2024-06-09T03:48:37.879Z",
					"__v": 2
				}
			```