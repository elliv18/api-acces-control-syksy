# API access cotrol service project

This project is API access control service system, what is created TAMK 5G00BD83-3004 Ohjelmistotekniikan projektityö course. Project API gateway is Tyk API gatewway. Backend is top of NodeJS and database is Postgress. Front end is top of NextJS and graphical library is Material UI. Every parts this project runs in docker container (Gateway, backend, database, frontend).

## Example `.env` file

Bellow is example `.env` file

```
    #  NODE_ENV

    NODE_ENV=development

    # DEBUG mode (0 = off, 1 = on)
    DEBUG=0

    # BACKEND

    BACKEND_PORT=3050
    BACKEND_HOST=localhost

    # jwt

    JWT_SECRET=T6Y3JRYmL6
    JWT_TIME=1d

    # bcrypt salt rounds

    SALT_ROUNDS=10

    # Root admin info

    ROOT_ADMIN_EMAIL=1
    ROOT_ADMIN_PASS=1

    # minium password length - max length is 18

    MIN_PW=3

    # PRISMA

    PRISMA_PORT=3060

    # FRONTEND

    FRONTEND_HOST=localhost
    FRONTEND_PORT=3000

    # PUBLIC URL

    PUBLIC_URL=localhost:3000
    PUBLIC_API_URL=

    # TYK MAIN SECRET
    TYK_GW_SECRET=352d20ee67be67f6340b4c0605b044b7

    # GOOGLE CLIENT ID
    GOOGLE_CLIENT_ID=801648603590-o007dgui6ndqkurfs5k0gu8bpsml5d70.apps.googleusercontent.com

    # GOOGLE SECRET
    GOOGLE_SECRET=ywHQXfdJQcZwGy1vksRCKgQ5
```

## Development environment setup

1. Clone the repo
2. Create a .env file(above) to the root folder of the repo
3. Navigate to `/backend` and run `yarn install`
4. Navigate to `/frontend` and run `yarn install`
5. Navigate to root of the repo, and run `docker-compose up -d`

Start developing.

### Code formatting

We use Prettier and TSLint.
All code has to pass `yarn lint` or it fails the CI.

## Project used technologies

- docker
- docker-compose
- Dotenv

### Backend

- Nodejs
- Express
- TypeScript
- Prisma
- Apollo server
- Graphql-Yoga
- merge-graphql-schemas-ts
- PostgreSQL
- Winston + daily rotate logs
- JWT
- google-auth-library

### Frontend

- Nextjs
- JavaScript ES6
- Material UI
- Apollo client
- Cookies
- React
- Webpack

## Backend logs

Backend log files is saved `backend` folder inside subfolder `logs`. `[root dir]/backend/logs`

Remote server backend logs is inside folder `/opt/app/logs`
