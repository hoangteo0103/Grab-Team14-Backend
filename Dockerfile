
# Installing dependencies:

FROM node:20-alpine AS install-dependencies

WORKDIR /user/src/app

COPY package.json package-lock.json ./

RUN NODE_ENV=development npm i

COPY . .


# Creating a build:

FROM node:20-alpine AS create-build

WORKDIR /user/src/app

COPY --from=install-dependencies /user/src/app ./

RUN npm run build

USER node


# Running the application:

FROM node:20-alpine AS run

WORKDIR /user/src/app

COPY --from=install-dependencies /user/src/app/node_modules ./node_modules
COPY --from=create-build /user/src/app/dist ./dist
COPY package.json ./

EXPOSE 3000

RUN curl -sSL https://sdk.cloud.google.com | bash

ENV PATH $PATH:/root/google-cloud-sdk/bin

CMD ["npm", "run", "start:prod"]