## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm i -g @nest/cli
$ npm install
```

## Creating new service

```bash
$ nest generate app {{service_name}}
```

## Creating new shared library

```bash
$ nest generate library {{library_name}}
```

## Running the app

Please following step by step
```bash
# database preparation
$ docker volume create ktsm-data
$ docker run --name postgres-container -e POSTGRES_PASSWORD=defaultpassword -p 54320:5432 -v ktsm-data:/var/lib/postgresql/data -d postgres
$ docker exec -it postgres-container psql -U postgres
$ CREATE DATABASE ktsm;
$ docker run -d -p 6379:6379 redislabs/redismod
# run service
$ nest start {{service_name}} --watch
```

## License

Nest is [MIT licensed](LICENSE).
