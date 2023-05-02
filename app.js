//jshint esversion:6

require("dotenv").config();
const express=require("express");
const ejs =require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const md5=require("md5");
// const encrypt=require("mongoose-encryption");
const app=express();

app.set('view engine',"ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema=new mongoose.Schema({
    email:String,
    Password:String
});

const secret=process.env.SECRET;
// userSchema.plugin(encrypt,{secret:secret,encryptedFields:['Password']});
const User= mongoose.model("User",userSchema);


app.get('/',function(req,res){
   
    res.render("home");
})
app.get('/register',function(req,res){
   res.render("register");
})
app.get('/login',function(req,res){
    res.render("login");
})
app.get('/secrets',function(req,res){
    res.render("secrets");
})

app.post('/register',function(req,res){
    

    const newUser= new User({
        email:req.body.username,
        Password:md5(req.body.password)
    })

    newUser.save();
    res.render('secrets');
    

})

app.post('/login',function(req,res){

    const username=req.body.username;
    const password=md5(req.body.password);

    User.findOne({email:username}).then((foundUser)=>{

         if(foundUser)
         {
             if(foundUser.Password===password)
             {
                  res.render("secrets");
             }
             else
             {
                res.send("not registered with  this account go and register");
             }
         }
         else
         {
            res.send("not registered with  this account go and register");
         }
        

    })
})
app.get('/submit',function(req,res){
    res.render("submit");
})

app.listen(3000,function(req,res){
    console.log("server started on port 3000");
})

