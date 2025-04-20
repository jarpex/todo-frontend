FROM node:23-slim AS build

WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM nginx:slim
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]