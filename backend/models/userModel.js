const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const UserModel = mongoose.Schema({
    name: {type: String, required:true},
    email:{type:String, required: true , unique:true},
    password:{type:String, required:true},
    pic:{
        type:String,
        required: false,
        default:
            "https://media.istockphoto.com/id/470100848/vector/male-profile-icon-white-on-the-blue-background.jpg?s=612x612&w=0&k=20&c=2Z3As7KdHqSKB6UDBpSIbMkwOgYQtbhSWrF1ZHX505E="

    },
},
{timestamps:true}
);
UserModel.methods.matchPassword = async function (enteredPassword) {
    const match = await bcrypt.compare(enteredPassword, this.password)
    console.log(match);
    return match
}
UserModel.pre('save', async function (next){
    if(!this.ismodified){
     next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    console.log("password hashed");
})
const User = mongoose.model("User", UserModel);
module.exports = User;