const sanitizer = require('sanitizer')

module.exports = {
    sanitizerEscape: (input)=>{
        Object.keys(input).forEach((props)=>{
            if(input[props] !== null)
            input[props] = sanitizer.escape(input[props])
        })
    }
}