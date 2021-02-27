FROM nginx:alpine as builder

ENV WF_SERVER http://localhost:8080/api

RUN apk add --update nodejs npm 

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build --prod

FROM nginx:alpine as serve

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/* /usr/share/nginx/html/