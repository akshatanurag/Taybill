const express = require('express')
const jwt = require('jsonwebtoken')

const {Rest} = require('../../models/rest')

const router = express.Router()

router.get("/qr/:id",(req,res)=>{
    let result = await Rest.findById(req.params.id)
    console.log(result)
})

module.exports = router