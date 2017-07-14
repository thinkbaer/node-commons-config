FROM debian:jessie

RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

RUN apt-get update && \
    apt-get install -y -q --no-install-recommends \
      apt-transport-https \
      curl \
      libpq-dev \
      g++ \
      make \
      ca-certificates

RUN curl --silent https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -

ENV NODE_SOURCE=node_6.x

RUN echo "deb https://deb.nodesource.com/$NODE_SOURCE jessie main" > /etc/apt/sources.list.d/nodesource.list && \
    echo "deb-src https://deb.nodesource.com/$NODE_SOURCE jessie main" >> /etc/apt/sources.list.d/nodesource.list

# For aios sync socket the c libaries must be compiled

RUN apt-get update && \
    apt-get -y install \
      nodejs \
      node-gyp \
      clang

RUN npm -g install \
      mocha \
      typescript


VOLUME /opt/commons-config

COPY ./docker-entrypoint.sh /

ENTRYPOINT ["/docker-entrypoint.sh"]