#!/bin/sh

VERSION=0.4.0

set -e

if [ "$1" = 'renew' ]; then
    echo "Recreate container"
    if [ "$(docker ps -aq -f status=exited -f name=commons-config)" ]; then
        # cleanup
        docker rm commons-config
    fi

    docker run --hostname commons-config \
           --name commons-config \
           -v $(pwd):/opt/commons-config \
           -it commons-config:0.4.0 /bin/bash
fi

if [ "$1" = 'build' ]; then
    echo "Rebuild image and delete older container"
    docker ps -a | awk '{ print $1,$2 }' | grep commons-config:0.4.0 | awk '{print $1 }' | xargs -I {} docker rm {}
    docker build --rm -t commons-config:0.4.0 .
fi


if [ "$1" = 'start' ]; then
    docker start -ia commons-config
fi

