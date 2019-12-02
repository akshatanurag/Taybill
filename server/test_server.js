const express = require('express');
const bodyParser = require('body-parser');

require('../db/connection');

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());



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


module.exports = app