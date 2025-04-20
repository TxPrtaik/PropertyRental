let mongoose=require('mongoose');
let Schema=mongoose.Schema;
let rent=new Schema({
    "uid":String,
    "pid":String,
    "startDate":String,
    "endDate":String,
    "totalAmount":String,
    "paidAmount":String,
    "paymentMethod":String,
    "transactionId":String,
    "isActive":Boolean
});
module.exports=mongoose.model("Rent",rent);