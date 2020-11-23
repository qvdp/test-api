FROM node:12

# env variables
ENV APP_ROOT /app
ENV NODE_ENV=production
ENV NODE_CONFIG_DIR=./config/env
ENV NODE_PORT=8080

# create app directory
WORKDIR ${APP_ROOT}
ADD . ${APP_ROOT}

# global install & update
RUN rm yarn.lock
RUN yarn

# expose 8080 on container
EXPOSE ${NODE_PORT}

# start the app
CMD [ "yarn", "start" ]
