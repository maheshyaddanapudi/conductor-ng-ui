FROM alpine as builder

RUN apk add --update nodejs npm 

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app

RUN npm install --save-dev --unsafe-perm node-sass@4

RUN npm install

COPY angular.json /app/angular.json
COPY set-env.ts /app/set-env.ts
COPY tsconfig.json /app/tsconfig.json
COPY tslint.json /app/tslint.json
COPY src /app/src

ENV DOCKER_MODE true

RUN npm run build-prod

FROM nginx:alpine as serve

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/conductor-ng-ui/ /usr/share/nginx/html/ 
COPY replace_api_url.sh /

CMD ["sh", "replace_api_url.sh"]
