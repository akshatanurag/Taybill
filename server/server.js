
const express = require('express');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const config = require('config');
const bodyParser = require('body-parser');
var cors = require('cors');
const hpp = require('hpp');
const helmet = require('helmet');
var compression = require('compression');
var contentLength = require('express-content-length-validator');
var MAX_CONTENT_LENGTH_ACCEPTED = 20000;
require('../db/connection');



//&& !process.env.SALT && !process.env.SESSION_SECRET && !process.env.password

// if (!config.get('jwtPrivateKey') ) {
//   console.log('FATAL ERROR: keys not defined');
//   process.exit(1);
// }


let port = process.env.PORT || 4000;
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  //ALL CODE GOES IN HERE
  const app = express();
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  
  app.use(bodyParser.json());
  app.use(cors({
    origin: [''],
    exposedHeaders: ['x-api-token','x-auth-token'],
    methods: ['GET','POST'],
    credentials: true
  }));
  app.use(hpp());
  app.disable('x-powered-by');
  app.use(function(req, res, next) {
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('X-Frame-Options', 'deny');
    res.header('X-Content-Type-Options', 'nosniff');
    //res.header('xhr.withCredentials','false');
    next();
  });
  app.use(helmet());
  app.use(
    helmet.hidePoweredBy({
      setTo: 'Taybill Server 1.0'
    })
  ); //change value of X-Powered-By header to given value
  app.use(helmet()); //set Cache-Control header
  app.use(helmet.noSniff()); // set X-Content-Type-Options header
  app.use(helmet.frameguard()); // set X-Frame-Options header
  app.use(helmet.xssFilter()); // set X-XSS-Protection header
  app.use(compression());
  app.use(
    contentLength.validateMax({
      max: MAX_CONTENT_LENGTH_ACCEPTED,
      status: 400,
      message: 'Limit Reached'
    })
  );


    app.get("/api",(req,res)=>{
        return res.status(200).send({success: true, message: "TayBill API v1.0"})
    })

    require('./routes_handler')(app)
    /**
     * 404 Pages
     */
    app.get('*', (req, res) => {
    return res.status(404).send({success: false, message: "Page not found"})
    });
    app.post('*', (req, res) => {
    return res.status(404).send({success: false, message: "Page not found"})
  });
 

  app.listen(port, process.env.IP);
}
