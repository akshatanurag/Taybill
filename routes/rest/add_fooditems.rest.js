const express = require('express')
const mongoose = require('mongoose')

const {Rest,addFoodItems} = require('../../models/rest')
const sanitize = require('../../utility/santize-input')

const restMiddleWare = require('../../middleware/rest/auth.rest.middleware')

const router = express.Router()

router.post('/rest/addfooditems',restMiddleWare.isRestLoggedIn,async (req,res)=>{
    try {
        let input = {name,price,qty,noOfPeople,pic,available,timeToCook} = req.body

        let {error} = addFoodItems(input)
        if(error)
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        })
        sanitize.sanitizerEscape(input)
        
        let result = await Rest.updateOne({email: req.rest.email},{
            $push: {items: {
                _id: mongoose.Types.ObjectId(),
                name: input.name,
                price: input.price,
                qty: input.qty,
                noOfPeople: input.noOfPeople,
                pic: input.pic,
                available: input.available,
                timeToCook: input.timeToCook
            }
        }
        })
        
        if(result.ok){
            return res.status(200).send({
                success: true,
                message: "Food Item(s) Added."
            })
        } else{
            //console.log(result)
          return res.status(400).send({
              success: false,
              message: "Food Item(s) not added. Something went wrong"
          })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            success: false,
            message: "Opps! Something went wrong..."
        })
    }  
})



module.exports = router