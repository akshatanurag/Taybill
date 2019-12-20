const express = require('express')
const mongoose = require('mongoose')
const restMiddleware = require('../../middleware/rest/rest.middleware')
var CryptoJS = require("crypto-js");


const {Table,verifyInput} = require('../../models/table.rest')

const sanitize = require('../../utility/santize-input')
/**
 * 
 * WARNING : NO SANITIZER HERE!!!
 * 
 */

const router = express.Router()

router.get("/table/view-all",[restMiddleware.isRestLoggedIn,restMiddleware.isDocsVerified,restMiddleware.isOTPVerified,restMiddleware.isProfileComplete],async (req,res)=>{
    let result = await Table.findOne({rest_id: req.currentRest._id})
    if(!result)
    return res.status(404).send({success: false,message: "No tables found"})
    res.status(200).send({success: true,message: result})
})

router.post("/table/add",[restMiddleware.isRestLoggedIn,restMiddleware.isDocsVerified,restMiddleware.isOTPVerified,restMiddleware.isProfileComplete],async (req,res)=>{
    let input = {inputObject} = req.body
    //console.log(input.inputObject)
    
    const {error} = verifyInput(input)
    if(error)
    return res.status(400).send({
        success: false,
        message: error.details[0].message
    })
    let tableNoArray = []
    for(var i=0;i<input.inputObject.length;i++){
        tableNoArray.push(input.inputObject[i].table_no)
        input.inputObject[i].qrcode = CryptoJS.AES.encrypt(JSON.stringify({table_no:input.inputObject[i].table_no,rest_id: req.currentRest._id}), 'taybillSecret123@akshat').toString()
        for(var j=i+1;j<input.inputObject.length;j++){
            if(input.inputObject[i].table_no == input.inputObject[j].table_no){
                // console.log(input.inputObject[i].table_no,input.inputObject[j].table_no)
                return res.status(400).send({
                    success: false,
                    message: `Duplicate Table No. ${input.inputObject[i].table_no}`
                })
                
            }

        }
    }
    //console.log(input.inputObject)
    
    let tableFound = await Table.findOne({rest_id: req.currentRest._id})
    //udate existing record
    if(tableFound){
        let dupFound = await Table.findOne({rest_id: req.currentRest._id,'tableInfo.table_no': {$in: tableNoArray}})
        if(dupFound)
        return res.status(400).send({
            success: false,
            message: "Duplicate Table no. found in db"
        })
        let pshArray = new Array()
        await input.inputObject.forEach(async (ele)=>{
            //sanitize.sanitizerEscape(ele)
            // let dataEncrypt =   CryptoJS.AES.encrypt(JSON.stringify({table_no:ele.table_no}), 'taybillSecret123@akshat').toString()
            // console.log(dataEncrypt)
            // var bytes  = CryptoJS.AES.decrypt(ele.qrcode.toString(), 'taybillSecret123@akshat');
            // var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
 
            // console.log(decryptedData);
            pshArray.push(ele)
        })
        let result = await Table.updateOne({rest_id: req.currentRest._id},{
             $push: {tableInfo: pshArray}
        })
        if(result.ok)
        return res.status(200).send({
            success: true,
            message: "Table(s) added successfully."
        })
        else
        return res.status(200).send({
            success: true,
            message: "Table(s) were not added."
        })
    }
    //create new table
    else{
    let table = new Table({
        rest_id: req.currentRest._id,        
    })
    await input.inputObject.forEach(async (ele)=>{
        table.tableInfo.push({
            table_no: ele.table_no,
            table_seat: ele.table_seat,
            qrcode: CryptoJS.AES.encrypt(JSON.stringify({table_no:ele.table_no,rest_id: req.currentRest._id}), 'taybillSecret123@akshat')
        })
    })
    let result = await table.save()
    if(result._id)
    return res.status(200).send({
        success: true,
        message: "Table(s) added successfully"
    })
    }

})

module.exports = router