let mongoose=require('mongoose');
let Schema=mongoose.Schema;
let img=new Schema({
"pid":String,
"image":String
});
module.exports=mongoose.model("PropertyImage",img);
