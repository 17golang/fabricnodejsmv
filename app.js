/**
 * Created by fengxiang on 2017/5/9.
 */

var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var winston = require('winston');
var config = require('./config.json');

var helper = require('./app/helper.js');
var channels = require('./app/create-channel.js');
var join = require('./app/join-channel.js');
var install = require('./app/install-chaincode.js');
var instantiate = require('./app/instantiate-chaincode.js');
var invoke = require('./app/invoke-transaction.js');
var query = require('./app/query.js');



var host = "localhost";
var port = "4000";


app.options('*', cors());
app.use(cors());
//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
    extended: false
}));


app.set('secret', 'thisismysecret');
app.use(expressJWT({
    secret: 'thisismysecret'
}).unless({
    path: ['/users']
}));
var logger = new(winston.Logger)({
    level: 'debug',
    transports: [
        new(winston.transports.Console)({
            colorize: true
        }),
    ]
});


var logger = new(winston.Logger)({
    level: 'debug',
    transports: [
        new(winston.transports.Console)({
            colorize: true
        }),
    ]
});



var server = http.createServer(app).listen(port, function() {});
logger.info('****************** 启动服务器 ************************');
logger.info('**************  http://' + host + ':' + port + '  ******************');
server.timeout = 240000;



app.post('/users', function(req, res) {


    logger.debug('End point : /users');
    logger.debug('User name : ' + req.body.username);
    logger.debug('Org name  : ' + req.body.orgName);
    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + parseInt(config.jwt_expiretime),
        username: req.body.username,
        //TODO: Are we using existing user or to register new users ?
        //password: req.body.password,
        orgName: req.body.orgName
    }, app.get('secret'));

    res.send("success!!!");
    // var promise = helper.getRegisteredUsers(req.body.username, req.body.orgName, true);
    //
    // promise.then(function(response) {
    //     if (response && typeof response !== 'string') {
    //         response.token = token;
    //         res.json(response);
    //     } else {
    //         res.json({
    //             success: false,
    //             message: response
    //         });
    //     }
    // });
});