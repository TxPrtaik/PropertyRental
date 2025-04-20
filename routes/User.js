let express=require('express');
let route=express.Router();
let user=require("../Model/User");
let veri=require("../Model/AccountVerification");
let prop=require("../Model/Property");
let enq=require("../Model/Enquiry")
let propimg=require('../Model/PropertyImage');
let propUser=require("../Model/PropertyUser");
let rent=require("../Model/Rent");
let noti=require("../Model/Notification")
route.get("/",async(req,res)=>{
    await user.find();
res.send("hello")
})
route.post("/create-account",async(req,res)=>{
    if(!req.body.role){
    req.body.role='user'
    }
    req.body.verified="false";
    let d=await user(req.body).save();
  
    res.send(d);
})
route.post("/login",async(req,res)=>{
    let d=await user.findOne({email:req.body.email,password:req.body.password});
    if(d!=undefined){
        res.send(d);
    }
    else{
        res.send("");
    }

})
route.get("/get-user/:id",async(req,res)=>{
  
    let d=await user.findById(req.params.id);
    checkRentalStatus();
  
    res.send(d);
})

route.post("/verify-acc/:id",async(req,res)=>{
    req.body.adhaarImage=new Date().getTime()+req.files.adhaarImage.name;
    req.files.adhaarImage.mv("public/"+req.body.adhaarImage);
    req.body.panImage=new Date().getTime()+req.files.panImage.name;
    req.files.panImage.mv("public/"+req.body.panImage);
    req.body.user_id=req.params.id;
  let d=await veri(req.body).save();
  let update=await user.findById(req.params.id).updateOne({verified:'true'});

    res.send("done");
})
route.put("/update-user/:id",async(req,res)=>{
    let d=await user.findById(req.params.id).updateOne(req.body);
    res.send("done");
})
route.post("/add-property",async(req,res)=>{
req.body.thumbnail=new Date().getTime()+req.files.thumbnail.name;
req.files.thumbnail.mv("public/"+req.body.thumbnail);
req.body.isAvilable=true;
req.body.user=null;
let d=await prop(req.body).save();
for(let i of req.files.images){
    let im=new Date().getTime()+i.name;
    i.mv("public/"+im);
    let obj={
        "image":im,
        "pid":d._id
    }
    await propimg(obj).save();
}

res.send("hello")
})
route.get("/get-properties/:id",async(req,res)=>{
    let d=await prop.find({owner:req.params.id}).sort({_id:-1});
    for(let i=0;i<d.length;i++){
        let owner=await user.findById(d[i].owner);
        d[i].owner=owner.company;
        d[i].owner_email=owner.email;
    }
    res.send(d);
})
route.get("/get-property/:id",async(req,res)=>{
   
    let property=await prop.findById(req.params.id);
    let imgs=await propimg.find({pid:req.params.id});
   
    let builder=await user.findById(property.owner);
    let obj={
        "prop":property,
        "imgs":imgs,
        "owner":builder
    }
    
    res.send(obj);
})
route.put("/update-image",async(req,res)=>{
 
    req.body.image=new Date().getTime()+req.files.image.name;
    req.files.image.mv("public/"+req.body.image);
    await propimg.findById(req.body.id).updateOne({image:req.body.image});

    res.send("done")
})
route.put("/update-property/:id",async(req,res)=>{
  if(req.files){
    req.body.thumbnail=new Date().getTime()+req.files.thumbnail.name;

    req.files.thumbnail.mv("public/"+req.body.thumbnail);
  }
    
  await prop.findById(req.params.id).updateOne(req.body);
    res.send("done")
})
route.delete("/delete-prop/:id",async(req,res)=>{
    let d=await prop.findById(req.params.id).deleteOne();
    res.send("done");
})
route.get("/get-properties",async(req,res)=>{
    let d=await prop.find({isAvilable:true}).sort({_id:-1});
    for(let i=0;i<d.length;i++){
        let owner=await user.findById(d[i].owner);
        d[i].owner=owner.company;
        d[i].owner_email=owner.email;
    }
    checkRentalStatus();
    res.send(d);

})
route.post("/add-enq",async(req,res)=>{
  req.body.date=new Date().toISOString().slice(0,10);
  req.body.user_name=null;
  req.body.user_email=null;
  req.body.user_pan=null;
  req.body.user_adhaar=null;
    await enq(req.body).save();
    
    res.send("done")
})
route.get("/get-enqs/:pid",async(req,res)=>{
    let d=await enq.find({pid:req.params.pid}).sort({_id:-1});
for(let i=0;i<d.length;i++){
    let u=await user.findById(d[i].uid);
    let verification=await veri.findOne({user_id:d[i].uid});
    d[i].user_name=u.name;
    d[i].user_email=u.email;
    d[i].user_adhaar=verification.adhaarImage;
    d[i].user_pan=verification.panImage;
}
res.send(d);
})
route.get("/check-user-prop/:id",async(req,res)=>{
let d=await prop.find({user:req.params.id});

res.send(d);
})
route.post("/allot-prop",async(req,res)=>{
  let d=await prop.findById(req.body.pid).updateOne({isAvilable:false,user:req.body.uid});
    await enq.find({pid:req.body.pid}).deleteMany();
    await enq.find({uid:req.body.uid}).deleteMany();
    let u=await user.findById(req.body.uid);
    let ud=await veri.findOne({user_id:u._id})
    let obj={
        "user":req.body.uid,
        "user_email":u.email,
        "user_pan":ud.panImage,
        "user_adhaar":ud.adhaarImage,
        "property":req.body.pid,
        "start_date":new Date().toISOString().slice(0,10),
        "end_date":null
    }
    await propUser(obj).save();
    res.send("done");
})
route.get("/get-user-by-prop/:id",async(req,res)=>{
    let d=await prop.findById(req.params.id);
    let u=await user.findById(d.user);
    let v=await veri.findOne({user_id:d.user});
    let obj={
        "user":u,
        "veri":v
    }
    res.send(obj);
})
route.post("/start-rent",async(req,res)=>{
  
    let cur=new Date().getTime();
    let start=new Date(req.body.startDate).getTime();
    let end=new Date(req.body.endDate).getTime();
    if(cur>=start&&cur<=end){
        req.body.isActive=true;
    }
    else{
        req.body.isActive=false;
    }
    let disDate=new Date(req.body.endDate);
    disDate.setDate(disDate.getDate()+1);
    let noti_obj={
        "subject":"Your rent is due",
        "userId":req.body.uid,
        "displayDate":disDate.toISOString().slice(0,10),
        "isRead":false,
        "link":`user-property`
    }
    await noti(noti_obj).save();
    await rent(req.body).save();

    res.send("done");
})
async function checkRentalStatus(){
    let props=await prop.find();
    for(let p of props){
let rents=await rent.findOne({pid:p._id});
if(p.user!=null){
    let start=new Date(i.startDate).getTime();
    let end=new Date(i.endDate).getTime();
  let cur=new Date().getTime();
  if(cur>=start&&cur<=end){
   await rent.findById(rents._id).updateOne({"isActive":true})
}
else{
    await rent.findById(rents._id).updateOne({"isActive":false})

}
}
    }
}
route.get("/get-cur-rental/:pid",async(req,res)=>{
   
    let p=await prop.findById(req.params.pid);

    let d=await rent.findOne({"uid":p.user,"pid":req.params.pid,"isActive":true});
  
    res.send(d); 


 
})
route.get("/get-cur-user-rent/:pid",async(req,res)=>{
    let p=await prop.findById(req.params.pid);

    let d=await rent.find({"uid":p.user,"pid":req.params.pid});
    res.send(d);

})
route.get("/get-prop-history/:id",async(req,res)=>{
    let d=await prop.findById(req.params.id);
    let preUsers=await propUser.find({property:d._id});
    for(let i=0;i<preUsers.length;i++){
        let u=await user.findById(preUsers[i].user);
   let verifi=await veri.findOne({user_id:u._id});
   preUsers[i].user_email=u.email;
   preUsers[i].user_adhaar=u.name;
    }
    res.send(preUsers);
 

})
route.put("/end-rental/:id",async(req,res)=>{
    let proper=await prop.findById(req.params.id);
    let d=await prop.findById(req.params.id).updateOne({"isAvilable":true,"user":null});
let rental=await rent.find({uid:proper.user});
for(let i of rental){

    if(i.uid==proper.user){
  
        let r=await rent.findById(i._id).updateOne({isActive:false});
       
    }
}
    let userPr = await propUser.updateMany(
        { property: req.params.id },
        { $set: { end_date: new Date().toISOString().slice(0, 10) } }
      );
         res.send("done");
})
route.get("/get-prop-by-user/:uid",async(req,res)=>{
    let d=await prop.findOne({user:req.params.uid});
    let imgs=await propimg.find({pid:d._id});
   
    let builder=await user.findById(d.owner);
    let obj={
        "prop":d,
        "imgs":imgs,
        "owner":builder
    }
   
    res.send(obj);
})
route.get("/get-cur-rent-user/:uid",async(req,res)=>{
    let d=await rent.findOne({uid:req.params.uid,isActive:true});
    res.send(d);
})
route.get("/get-user-rent-his/:uid/:pid",async(req,res)=>{
let d=await rent.find({uid:req.params.uid,pid:req.params.pid});

res.send(d);
})
route.get("/get-notification/:uid",async(req,res)=>{
    let d=await noti.find({displayDate:new Date().toISOString().slice(0,10),isRead:false,userId:req.params.uid});


res.send(d);
})
route.get("/mark-as-read/:id",async(req,res)=>{
    let d=await noti.findById(req.params.id).updateOne({isRead:true});
    res.send("done");
})
route.delete("/delete-prop-img/:id",async(req,res)=>{
    let d=await propimg.findById(req.params.id).deleteOne();
    res.send("done");
})
module.exports=route;