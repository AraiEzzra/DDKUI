FROM    nginx

USER    root
RUN     apt-get update
RUN     apt-get install curl gnupg git -y
RUN     curl -sL https://deb.nodesource.com/setup_10.x | /bin/bash -
RUN     apt-get install build-essential nodejs -y
RUN     npm install --global npm@latest && \
        npm install --global grunt-cli@latest && \
        npm install --global bower@latest

WORKDIR /home/ddk
RUN     chmod -R 777 /home/ddk

COPY    ./package.json /home/ddk/
COPY    ./config.json /home/ddk/
COPY    ./public /home/ddk/public

RUN     npm install
RUN     cd public && \
        bower install --allow-root && \
        npm install

RUN     cd public && grunt release
