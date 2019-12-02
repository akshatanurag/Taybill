const mongoose = require('mongoose')
const config = require('config')
mongoose.connect(`${config.get('db')}`,{
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=>{
    //connected
}).catch(()=>{
    console.log("DB not connected")
})

mongoose.Promise = global.Promise

module.exports = {
    mongoose
}