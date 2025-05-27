const express = require('express');
const ejs = require('ejs');
const path = require('path');
const router = require('./Routers/routes');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = require('./Configuration/swagger.confic')
require('./db');
const auth = require('./Middleware/auth');

const HTTP_Server = express();

HTTP_Server.set('view engine', 'ejs');
HTTP_Server.set('views', path.join(__dirname, 'views'));

HTTP_Server.use(bodyParser.json());
HTTP_Server.use(bodyParser.urlencoded({ extended: false }));

HTTP_Server.use(cookieParser());  // ✅ Correct order
HTTP_Server.use(auth);            // ✅ Middleware that uses cookies

//Swagger configurations
const swaggerSpec = swaggerJsdoc(swaggerOptions);
HTTP_Server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

HTTP_Server.use('/', router);     // ✅ Routes come after middlewares

HTTP_Server.listen(3000, (err) => {
    if (err) {
        console.log('Error occurred when listening: ', err);
    } else {
        console.log('Port 3000 has been started');
        console.log('Swagger docs at http://localhost:3000/api-docs');
    }

});
