FROM node:19-alpine as base

FROM base as builder

WORKDIR /oci-visualization-tool

COPY package.json package-lock.json ./
COPY packages/app/ ./packages/app
COPY packages/common/ ./packages/common

RUN npm ci

# make sure vite bakes VITE_API into js during build stage
ENV API_PORT=8546
ENV VITE_API=http://localhost:${API_PORT}

RUN npm run build

FROM nginx:1.23.3-alpine as runner

COPY --from=builder /oci-visualization-tool/packages/app/dist /usr/share/nginx/html/

EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]
