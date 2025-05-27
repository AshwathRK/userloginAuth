const express = require('express');
const ejs = require('ejs');
const path = require('path');
const router = require('./Routers/routes');
var cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
require('./db');
const auth =  require("./Middleware/auth")


const HTTP_Server = express();

HTTP_Server.set('view engine', 'ejs');
HTTP_Server.set('views', path.join(__dirname, 'views'));

// ✅ Middleware should come BEFORE router
HTTP_Server.use(bodyParser.json());
HTTP_Server.use(bodyParser.urlencoded({ extended: false }));

// ✅ Now mount router
HTTP_Server.use('/', router);
HTTP_Server.use(cookieParser());
HTTP_Server.use(auth)


// Start server
HTTP_Server.listen('3000', (err) => {
    if (err) {
        console.log('Error occurred when listening: ', err);
    } else {
        console.log('Port 3000 has been started');
    }
});
