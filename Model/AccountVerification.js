let mongoose=require('mongoose');
let Schema=mongoose.Schema;
let verifaction=new Schema({
    "user_id":String,
    "adhaarNumber":String,
    "adhaarImage":String,
    "panNumber":String,
    "panImage":String,
    "age":String
})
module.exports=mongoose.model("AccountVerification",verifaction);