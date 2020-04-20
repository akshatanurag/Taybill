const express = require('express')
const {Order} = require('../../models/order')
const joi = require('@hapi/joi')

const santize = require('../../utility/santize-input')

const router =  express.Router()

const restMiddleware = require('../../middleware/rest/rest.middleware')

router.get("/myorder",[restMiddleware.isRestLoggedIn],async (req,res)=>{
    let orders = await Order.find({
        rest_id: req.currentRest._id
    })
    if(orders)
    return res.status(200).send({
        success: true,
        message: orders
    })
    else
    return res.status(404).send({
        success: false,
        message: "No Orders Placed."
    })

})

router.post("/myorder/action/:id",async (req,res)=>{
    let input = {accepted,delivered,reason} = req.body

    const schema = joi.object().keys({
        accepted: joi.boolean().required(),
        delivered: joi.boolean().required(),
        rejectMessage: joi.string()
      })
      if(a = await schema.validate(input).error)
      return res.status(400).send({
        success: false,
        message: a.details[0].message
      })

    santize.sanitizerEscape(input)
    if(!input.accepted && input.rejectMessage == null){
    return res.status(400).send({
        success: false,
        message: "Please send reason for rejecting"
    })
   } else{
    let result = await Order.updateOne({_id: req.params.id},{$set: {
        accepted: input.accepted,
        delivered: input.delivered,
        rejectMessage: input.rejectMessage
    }})
    if(result.ok)
    return res.status(200).send({
        success: true,
        message: "action(s) updated."
    })
    }


    
})

module.exports = router