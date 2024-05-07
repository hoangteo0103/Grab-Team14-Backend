# Installing dependencies:

FROM node:20-alpine AS install-dependencies

WORKDIR /user/src/app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

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
CMD ["npm", "run", "start:prod"]