let mongoose=require('mongoose');
let Schema=mongoose.Schema;
let propuser=new Schema({
    "user":String,
    "user_adhaar":String,
    "user_email":String,
    "user_adhaar":String,
    "user_pan":String,
    "property":String,
    "start_date":String,
    "end_date":String
})
module.exports=mongoose.model("PropertyUser",propuser);