const mongoose = require('mongoose')
const config = require('config')
mongoose.connect(`mongodb+srv://root:toor@cluster0-kkzmc.mongodb.net/taybill`,{
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