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
- /users/register:
	* method: post
	* authorization: not required
	* inputs: { name: string, email: string, password: string}
	* returns: email

- /users/login:
	* method: post
	* authorization: not required
	* inputs: { email: string, password: string}
	* returns: email