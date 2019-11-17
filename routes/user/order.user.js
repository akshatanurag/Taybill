const express = require('express')

const userMiddleware = require('../../middleware/user/auth.middleware')
const sanitize = require('../../utility/santize-input')

const {Order,orderJoi} = require('../../models/order')
const {Rest} = require('../../models/rest')

const router = express.Router()



router.post("/order",userMiddleware.isLoggedIn,async (req,res)=>{
    let input = {rest_id,orderedItems} = req.body
    let {error} = orderJoi(input)
    var orderArray = Object.keys(input.orderedItems).map((key)=>{
        return input.orderedItems[key];
    })
    if(error)
    return res.status(400).send({success: false, message: error.details[0].message})

    sanitize.sanitizerEscape(input)

    let rest = await Rest.findOne({_id: input.rest_id,'items._id': {$in: orderArray}},{password: 0,verify: 0})
    let price = 0;
    let avgTime = 0
    var order = new Order({
        rest_id: input.rest_id,
        user_id: req.currentUser._id
    })
    await rest.items.forEach(element => {
        orderArray.forEach(async ele=>{
            if(ele == element._id){
                await order.orderedItems.push(element)
                price +=  element.price
                avgTime +=element.timeToCook
            }
        })
    });
    order.bill = price
    order.avgTime = (avgTime/orderArray.length)
    let result = await order.save()
    if(result !== null)
    return res.status(200).send({
        success: true,
        message: "Order Placed"
    })
    

})

router.get("/order/:id",userMiddleware.isLoggedIn,async (req,res)=>{
    let result = await Order.find({_id: req.params.id,user_id: req.currentUser._id})
    if(result !== null || result !== [])
    return res.status(200).send({
        success: true,
        message: result
    })
    else
    return res.status(400).send({
        success: false,
        message: "Cannot fetch Order."
    })
})

module.exports = router