let mongoose=require('mongoose');
let Schema=mongoose.Schema;
let property=new Schema({
    "thumbnail":String,
    "flatType":String,
    "houseNo":String,
    "address":String,
    "rent":String,
    "isAvilable":Boolean,
    "owner":String,
    "propertyDetails":String,
    "pincode":String,
    "user":String
});
module.exports=mongoose.model("Property",property);
