var express = require('express');
var http = require('http');
var cors = require('cors');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();
var port = process.env.PORT || '7001';

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb', parameterLimit: 5000 }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(cookieParser());

app.get('/', function (req, res) {
    res.render('wallet.html', { layout: false });
});

app.use(function (req, res, next) {

    if (req.url.indexOf('/api/') === -1 && req.url.indexOf('/peer/') === -1 && req.url.indexOf('/referal') === -1) {
        return res.redirect('/');
    }
    next();
});

app.use(function (req, res, next) {
    res.render('wallet.html', { layout: false });
});


app.listen(port, function() {
    console.log('server running on port : ', port);
})
