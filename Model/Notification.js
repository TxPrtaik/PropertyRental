let mongoose=require('mongoose');
let Schema=mongoose.Schema;
let noti=new Schema({
    "subject":String,
    "userId":String,
    "displayDate":String,
    "isRead":Boolean,
    "link":String
})
module.exports=mongoose.model("notifications",noti);