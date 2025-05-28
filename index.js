const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const path = require('path');
const router = require('./Routers/routes');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = require('./Configuration/swagger.confic');
require('./db');
const auth = require('./Middleware/auth');

const HTTP_Server = express();

// ✅ Use CORS with proper config
HTTP_Server.use(cors({
    origin: 'http://localhost:5173', // Update if your frontend runs elsewhere
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Set up EJS view engine
HTTP_Server.set('view engine', 'ejs');
HTTP_Server.set('views', path.join(__dirname, 'views'));

// ✅ Middleware for static files, parsing JSON/body/cookies
HTTP_Server.use(express.static('public'));
HTTP_Server.use(bodyParser.json());
HTTP_Server.use(bodyParser.urlencoded({ extended: false }));
HTTP_Server.use(cookieParser());

// ✅ Swagger before auth
const swaggerSpec = swaggerJsdoc(swaggerOptions);
HTTP_Server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Auth middleware BEFORE routes
HTTP_Server.use(auth);

// ✅ API routes
HTTP_Server.use('/', router);

// ✅ Start the server
HTTP_Server.listen(3000, (err) => {
    if (err) {
        console.log('Error occurred when listening: ', err);
    } else {
        console.log('✅ Server started on http://localhost:3000');
        console.log('📘 Swagger docs available at http://localhost:3000/api-docs');
    }
});
