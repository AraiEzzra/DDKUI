const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const request = require('request');
const config = require('./config.json');

const app = express();
const port = config.port || '7000';

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb', parameterLimit: 5000 }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(cookieParser());

app.get('/', function (req, res) {

    var serverURL = config.serverProtocol + '://' + config.serverHost;
    if (config.serverProtocol === 'http') {
        serverURL = serverURL + ':' + config.serverPort;
    }
    request(serverURL, { json: true }, function (err, resp, body) {
        if (body && body.success == true) {
            res.render('wallet.html', { layout: false });
        } else {
            res.render('loading.html');
        }
    });
});

app.use(function (req, res, next) {

    if (req.url.indexOf('/api/') === -1 && req.url.indexOf('/peer/') === -1 && req.url.indexOf('/referral') === -1) {
        return res.redirect('/');
    }
    next();
});

app.use(function (req, res, next) {
    res.render('wallet.html', { layout: false });
});


app.listen(port, function() {
    console.log('server running on port : ', port);
});
