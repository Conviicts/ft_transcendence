FROM node:lts-alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

RUN npm i -g npm@latest @nestjs/cli
RUN npm i prisma --save-dev
RUN npm i
COPY prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "start:dev"]