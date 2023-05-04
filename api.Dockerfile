FROM node:19-alpine as base

FROM base as builder

WORKDIR /oci-visualization-tool

COPY package.json package-lock.json ./
COPY packages/api/ ./packages/api
COPY packages/common/ ./packages/common

RUN npm ci
RUN npm run build

####################################

FROM base as runner

WORKDIR /oci-visualization-tool

COPY package.json package-lock.json ./
COPY packages/api/package.json ./packages/api/
COPY packages/common/package.json ./packages/common/

ENV NODE_ENV=production

#RUN npm ci --production
RUN npm ci --omit=dev

COPY --from=builder /oci-visualization-tool/packages/api/dist ./packages/api/dist
COPY --from=builder /oci-visualization-tool/packages/common/dist ./packages/common/dist

ENV PROFILE=DEFAULT
ENV PORT=8546

EXPOSE ${PORT}

ENTRYPOINT [ "node", "packages/api/dist/index.js" ]
