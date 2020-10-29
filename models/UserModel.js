const mongoose  =  require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        required:true,
        type:String,
        unique:true
    },
    username:{
        required:true,
        type:String,
        minlength:3
    },
    password:{
        required:true,
        type:String,
        minlength:5
    }
})

module.exports = User = mongoose.model('Users', userSchema)