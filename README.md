# DDK UI
## Prerequisite for ETP system
This sections provides details on what you need install on your system in order to run DDK.

- ### Tool chain components -- Used for compiling dependencies
```
sudo apt-get install -y python build-essential curl automake autoconf libtool
```

- ### Git -- Used for cloning and updating ETP
```
sudo apt-get install -y git
```

- ### Node.js -- Node.js serves as the underlying engine for code execution.
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```
## Set up UI for ETP
### 1. Clone code
```
$ git clone https://github.com/oodlestechnologies/DDK-UI
```
### 2. Inside your project directory `DDK-UI`, run following commands
```
cd public 
npm install 
bower install 
grunt release
```
## Run the server
```
$ node server.js
```
