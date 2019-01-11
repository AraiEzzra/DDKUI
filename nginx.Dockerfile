FROM    nginx

RUN     groupadd ddk -g 1100 && useradd -u 1100 ddk -g ddk

USER    root
RUN     apt-get update
RUN     apt-get install curl gnupg -y
RUN     curl -sL https://deb.nodesource.com/setup_10.x | /bin/bash -
RUN     apt-get install build-essential nodejs -y
RUN     npm install --global npm@latest && \
        npm install --global grunt-cli@latest && \
        npm install --global bower@latest

WORKDIR /home/ddk
RUN     chmod -R 777 /home/ddk

USER    ddk

COPY    --chown=ddk ./package.json /home/ddk/
COPY    --chown=ddk ./config.json /home/ddk/
COPY    --chown=ddk ./public /home/ddk/public

RUN     npm install
RUN     cd public && \
        bower install --allow-root && \
        npm install

RUN     cd public && grunt release

# TODO: add permissions to ddk user for nginx
USER    root
