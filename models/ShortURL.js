const mongoose = require('mongoose');

const shortURLSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    longURL : {
        type : String,
        required : true,
        unique : true,
        match : /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    },
    shortURL : {
        type : String,
        unique : true
    },
    clicks : {
        type : Number,
        default : 0
    }
})

module.exports = mongoose.model('ShortURL', shortURLSchema);