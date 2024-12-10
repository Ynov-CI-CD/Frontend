FROM node:22-alpine as build
WORKDIR /usr/local/app
COPY . /usr/local/app/
RUN npm install
RUN npm run build:compose


FROM nginx:1.27.2-alpine
COPY --from=build /usr/local/app/dist/integration_deploiement_group_front/browser /usr/share/nginx/html
EXPOSE 80
