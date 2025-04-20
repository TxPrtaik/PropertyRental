let mongoose=require('mongoose');
let Schema=mongoose.Schema;
let Enq=new Schema({
    "pid":String,
    "uid":String,
    "user_name":String,
    "user_email":String,
    "user_pan":String,
    "user_adhaar":String,
    "date":String
})
module.exports=mongoose.model("Enquiries",Enq);