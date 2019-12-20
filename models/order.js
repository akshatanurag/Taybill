const mongoose = require('mongoose')
const joi = require('@hapi/joi')

var orderSchema= new mongoose.Schema({
    rest_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    orderedItems: [],
    bill: {
        type: Number,
        required: true
    },
    avgTime: {
        type: Number,
        required: true
    },
    noOfPeople: {
        type: Number
    },
    payment: {
        isPaid: {
            type: Boolean,
            default: false
        },
        paymentMethod: {
            type: String,
        },
        paymentID: {
            type: String
        }
    },
    orderServed: {
        type: Boolean,
        default: false
    },


})

var Order = mongoose.model('orders',orderSchema)

const orderJoi = (input)=>{
    const schema = joi.object().keys({
        rest_id: joi.string().min(1).max(24).required(),
        orderedItems: joi.array().min(1).required(),
        qr: joi.string().min(1).max(200).required(),
        lng: joi.number().required(),
        lat: joi.number().required()

    })
    return schema.validate(input)
}

module.exports = {
    Order,
    orderJoi
}