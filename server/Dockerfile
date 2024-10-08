# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.6.0

FROM node:${NODE_VERSION}-alpine

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN npm i npm@latest -g

# Run the application as a non-root user.
USER node

WORKDIR /opt/node_app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
# RUN --mount=type=bind,source=package.json,target=package.json \
#     --mount=type=bind,source=package-lock.json,target=package-lock.json \
#     --mount=type=cache,target=/root/.npm \
#     npm ci --omit=dev 

# For development
# RUN --mount=type=bind,source=package.json,target=package.json \
#     --mount=type=bind,source=package-lock.json,target=package-lock.json \
#     --mount=type=cache,target=/root/.npm \
#     npm ci

COPY --chown=node:node package.json package-lock.json* ./
RUN npm ci && npm cache clean --force
ENV PATH /opt/node_app/node_modules/.bin:$PATH

# check every 30s to ensure this service returns HTTP 200
HEALTHCHECK --interval=30s CMD node healthcheck.js

# copy in our source code last, as it changes the most
# copy in as node user, so permissions match what we need
WORKDIR /opt/node_app/app
COPY --chown=node:node . .

# Expose the port that the application listens on.
EXPOSE 8080

# Run the application.
# CMD ["node", "index-dev.js"]
CMD ["./node_modules/.bin/nodemon", "-L", "--watch", "index-dev.js", "index-dev.js"]
