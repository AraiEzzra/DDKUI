FROM node:8.9.4
RUN mkdir -p /usr/src/app/
COPY package.json .
WORKDIR /usr/src/app
RUN npm install
RUN mkdir -p /usr/src/app/public
COPY public/package.json /usr/src/app/public/
WORKDIR /usr/src/app/public/
RUN npm install
COPY . /usr/src/app/
WORKDIR /usr/src/app/public/
#RUN npm install grunt-cli
#RUN npm install -g bower
#RUN bower install --allow-root
WORKDIR /usr/src/app
RUN mkdir /usr/src/app/public/bower_components
COPY ./bower_components/ /usr/src/app/public/bower_components/
WORKDIR /usr/src/app/public
RUN ./node_modules/.bin/grunt release
WORKDIR /usr/src/app/
CMD [ "node","server.js" ]
