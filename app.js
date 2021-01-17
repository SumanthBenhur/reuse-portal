//jshint esversion:6
//require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const multer =require("multer");
const path=require("path");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology:true} );
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
  });

  const infoschema =new mongoose.Schema( {
    name:String,
    phone:Number,
    email:String,
    prn:Number,
    walink:String    
   });

   const products =new mongoose.Schema( {
       nop:String,
       email:String,
       img:String,
       dop:String,
       category:String,
       walink:String,
       pno:Number

   });

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
const Info = new mongoose.model("Info",infoschema);
const product = new mongoose.model("product",products);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
    res.render("home");
  });


  app.get("/login", function(req, res){
    res.render("login");
  });

  app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
  });
  
  app.get("/register", function(req, res){
    res.render("register");
  });

  app.get("/display",function(req,res){
     
     product.find( {} ,function(err, founditems){
      console.log(founditems);
      res.render("display", { variable: founditems});
    });  
        
  });


  app.get("/furniture",function(req,res){
    if(req.isAuthenticated()){  
    product.find( {category:{$eq:'Furniture'}} ,function(err, foundfur){
     console.log(foundfur);
     Info.findOne({email : req.user.username}, function(err, result){
      if(err) console.log(err);
      else console.log(result);
      res.render("furniture", { name:result.name,variable: foundfur});
    });
     
   });  
  }
  else{
    res.redirect("/login");
  }
       
 });

 app.get("/stationary",function(req,res){
  if(req.isAuthenticated()){  
  product.find( {category:{$eq:'Stationary'}} ,function(err, foundfur){
   console.log(foundfur);
   Info.findOne({email : req.user.username}, function(err, result){
    if(err) console.log(err);
    else console.log(result);
    res.render("stationary", { name:result.name,variable: foundfur});
  });
   
 });
 }
 else{
  res.redirect("/login");
 } 
     
});

app.get("/books",function(req,res){
  if(req.isAuthenticated()){   
  product.find( {category:{$eq:'Books'}} ,function(err, foundfur){
   console.log(foundfur);
   Info.findOne({email : req.user.username}, function(err, result){
    if(err) console.log(err);
    else console.log(result);
    res.render("books", { name:result.name,variable: foundfur});
  });
  
   
 });  


  }
  else{
    res.redirect("/login");
  }
     
});


  app.get("/index", function(req, res){
      if(req.isAuthenticated()){
        //console.log(req.user.username);
        Info.findOne({email : req.user.username}, function(err, result){
          if(err) console.log(err);
          else console.log(result);
          res.render("index", {name: result.name});
        });
       
       
          
      }
      else{
          res.redirect("/login");
      }
  });
  app.get("/add", function(req, res){
    if(req.isAuthenticated()){
    
    Info.findOne({email : req.user.username}, function(err, result){
      if(err) console.log(err);
      else console.log(result);
      res.render("add", {name: result.name});
    });    
    }else{
      res.redirect("/login");
    }
    
  });


  app.get("/profile", function(req, res){
    if(req.isAuthenticated()){
      //console.log(req.user.username);
      Info.findOne({email : req.user.username}, function(err, result){
        if(err) console.log(err);
        else 
        res.render("profile", {name: result.name, email: result.email, phone : result.phone, prn: result.prn, walink: result.walink});
      })
        
    }
    else{
        res.redirect("/login");
    }
  });


  app.post("/register", function(req, res){

const name = req.body.name;
const phone = req.body.phone;
const email =req.body.username;
const prn=req.body.prn;
const walink = req.body.walink;
 
const userdetails=new Info({
name:name,
phone:phone,
email:email,
prn:prn,
walink:walink
});
console.log(userdetails);


    User.register({username: req.body.username}, req.body.password, function(err, user){
      if (err) {
        console.log(err);
        //alert("Email already taken");
        res.redirect("/register");
        
      } else {
        passport.authenticate("local", {failureFlash : true})(req, res, function(){
          userdetails.save();
          res.redirect("/index");
        });
      }
    });
  
  });
  
  app.post("/login", function(req, res){
  
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
  
    req.login(user, function(err){
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/index");
        });
      }
    });
  
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
  var storage = multer.diskStorage({
    destination:"./public/uploads/",
    filename:(req,file,cb)=>{cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }

  });

  var upload=multer({
    storage:storage
  }).single('img');

  app.post("/add",upload,function(req,res,next) {
    var sucess= req.file.filename +" uploaded successfully";
    var walink;
    var pno;
    Info.findOne({email : req.user.username}, function(err, result){
      if(err) console.log(err);
      else 
      {
       walink=result.walink;
       pno=result.phone;
       console.log(pno);
       console.log(walink);
      }
      var item=new product({
        nop:req.body.nop,
        img:req.file.filename,
        email: req.user.username,
        dop:req.body.dop ,
        category:req.body.selectpicker,
        walink:result.walink,
        pno:result.phone
      });
      item.save();
    });
   
    res.redirect("index"); 

    
  });

  
  
  app.listen(3000, function() {
    console.log("Server started on port 3000.");
  });




  