FROM node:16 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g @angular/cli
RUN npm install
COPY . .
RUN ng build

FROM nginx:1.19
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/front /usr/share/nginx/html

