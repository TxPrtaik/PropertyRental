let express=require('express');
let upload=require('express-fileupload');
let session=require('express-session');
let mongoose=require('mongoose');
let bodyparser=require("body-parser");
let user=require("./routes/User")
let cors=require('cors');


let app=express();
app.use(cors());
app.use(express.json())
app.use(upload());
app.use(express.static("public/"));
app.use(session({
    secret:"1234",
    resave:true,
    saveUninitialized:true
}))
app.use(bodyparser.urlencoded({extended:true}));
app.use("/",user);
app.listen(1000);