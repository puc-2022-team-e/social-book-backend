# social-book-backend
Backend MVP for the social book project;

This project is part of the post graduation in software engineering;

## Running locally
After cloning this repository: 

```
# this command will install globally the typescript
# this command must be executed with superuser permissions 
~$ npm i -g typescript

```

And then start to setup
```
# this command will download all node_modules
~$ npm i 

```

## Running the server
```
#this command will transpile TypeScript to JavaScript in a folder named 'dist'
~$ npm run build
~$ npm run start
```

## build & run locally with docker

```
#build
~$ docker build . -f $PWD/devops/ci/Dockerfile -t social-books

```
and then...

```
#run
~$ docker run --rm -ti -p 8077:8077 social-books
```