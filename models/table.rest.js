const mongoose = require('mongoose')
const joi = require('@hapi/joi')
var tableSchema = new mongoose.Schema({
    rest_id: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true
    },
    tableInfo: [{
        table_id: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true
        },
        table_no: {
            type: Number,
            unique: true
        },
        table_seat: {
            type: Number
        },
        qrCodeStatus: {
            type: String,
            required: true,
            default: "Free"
        },
        qrcode: {
            type: String,
            required: true
        }
    }],

})

mongoose.Promise = global.Promise

var Table = mongoose.model("rest_table",tableSchema)

const verifyInput = (input)=>{
    const schema = joi.object().keys({
        inputObject: joi.array().min(1).required(),
    })
    return schema.validate(input)
}
module.exports = {
    Table,
    verifyInput
}