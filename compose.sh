#!/bin/bash

if [ -e $ENV ]; then
    ENV_FILE=".env"
else
    ENV_FILE=".env.compose.$ENV"
fi

set -o allexport
. $ENV_FILE
set +o allexport

cat << EOF
******************************
* EMATRIC / PROJECT LAUNCHER *
******************************

Launched Profiles: ${COMPOSE_PROFILES}
EOF


if [ -e $ENV ]; then
    ENV=prod
fi

docker compose --env-file $ENV_FILE -f compose.base.yml -f compose.$ENV.yml $@
