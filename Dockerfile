FROM node:20-alpine AS build
RUN apk add --no-cache python3 py3-pip make g++ && \
    ln -sf python3 /usr/bin/python
WORKDIR /usr/local/app
COPY . /usr/local/app/
RUN npm install --legacy-peer-deps
RUN npm run build:compose

FROM nginx:1.27.2-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/local/app/dist/integration_deploiement_group_front/browser /usr/share/nginx/html
EXPOSE 80
