# Installing dependencies:

FROM node:20-alpine AS install-dependencies

ENV MONGODB_URI='mongodb+srv://hoangteo0103:hoangteo0103@test1.y97bp8x.mongodb.net/Grab-Data?retryWrites=true&w=majority&appName=Test1'
ENV PORT='8080'
ENV AWS_ACCESS_KEY_ID='AKIAXHE3RUWMKZZCS257'
ENV AWS_SECRET_ACCESS_KEY='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'
ENV AWS_REGION='ap-southeast-1'
ENV AWS_PUBLIC_BUCKET_NAME='grabbootcamp'
ENV ELASTICSEARCH_CLOUD_ID='546151cefbac4764906adaa3f9866351:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJGUxMzQzYjdhMWY5ZDRkNzk5M2E1ZGViZjAxYTgwYTY0JGJlMWY4MTBmNWM3OTQyNmRiMTY1YmQ0NWM3NGI4YmQ4'
ENV ELASTICSEARCH_USERNAME='grab-data'
ENV ELASTICSEARCH_PASSWORD='grab-data'
ENV PROJECT_ID='lunar-standard-423809-e5'
ENV LOCATION='us-central1'





WORKDIR /user/src/app

COPY package.json package-lock.json ./

RUN npm install

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