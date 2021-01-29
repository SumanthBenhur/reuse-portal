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
const { resolveSoa } = require("dns");
const popup = require('popups');

const app = express();
//to connect js and css files in public
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
//to set session
app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());

//connect to mongodb
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology:true} );
mongoose.set("useCreateIndex", true);

//schemas of different collections
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

//creating models based on schemas
const User = new mongoose.model("User", userSchema);
const Info = new mongoose.model("Info",infoschema);
const product = new mongoose.model("product",products);

passport.use(User.createStrategy());

//serializing and deseializing sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//to render home page
app.get("/", function(req, res){
    res.render("home");
  });

//to render login page
  app.get("/login", function(req, res){
    res.render("login");
  });

  //to redirect after logout
  app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
  });
  
  //to render register
  app.get("/register", function(req, res){
    res.render("register");
  });

  

//individual pages to display products according to categories
  app.get("/furniture",function(req,res){
    if(req.isAuthenticated()){  
    product.find( {category:{$eq:'Furniture'}} ,function(err, foundfur){
    
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

//to send variables of particular productid to html 
app.get("/product/:productId", function(req, res){
  const requestedProductId = req.params.productId;

  product.findOne({_id : requestedProductId}, function(err, post){
    res.render("product", {nop : post.nop, email : post.email, dop : post.dop, walink : post.walink, pno : post.pno, img : post.img});
  });
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
        else {
        product.find( {email : req.user.username} ,function(err, founditems){
          res.render("profile", { variable: founditems,name: result.name, email: result.email, phone : result.phone, prn: result.prn, walink: result.walink});
        });
        };
      })
        
    }
    else{
        res.redirect("/login");
    }
  });


  //to delete product from mongodb

  app.get("/delete/:Id", function(req, res){
    const requestedProductId = req.params.Id;
    if(req.isAuthenticated()){ 
    product.deleteOne({_id : requestedProductId}, function(err, post){
      Info.findOne({email : req.user.username}, function(err, result){
        if(err) console.log(err);
        else console.log(result);
        res.redirect("/profile");
      });
    });
  }
  else{
    res.redirect("/login");
}
  });





//to register user

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

  //to create storage using multer
  var storage = multer.diskStorage({
    destination:"./public/uploads/",
    filename:(req,file,cb)=>{cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }

  });

  var upload=multer({
    storage:storage
  }).single('img');

  //to add products to collection
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

  //to get update and send variables
  app.get("/update/:Id", function(req, res){
    const requestedProductId = req.params.Id;
    if(req.isAuthenticated())
    {
    
      Info.findOne({email : req.user.username}, function(err, result){
        if(err) console.log(err);
        else 
        product.findById(requestedProductId,function(err,product){
          res.render("updateProduct",{
            product:product,
            name: result.name
          });
        });
       
      });    
}
  });


  //to update product details using updateMany
  app.post("/update/:Id",function(req,res) {
    if(req.isAuthenticated()){

  const requestedProductId = req.params.Id;
  console.log(requestedProductId);
   const nop=req.body.nop;
   const dop=req.body.dop;
   const category =req.body.selectpicker; 
   
   /* console.log(dop); */
  
    
    product.updateMany({_id : requestedProductId},{$set:{nop: req.body.nop, dop:req.body.dop,category:req.body.selectpicker}},{multi:true}, function(err, post){
      Info.findOne({email : req.user.username}, function(err, result){
        if(err) console.log(err);
        else console.log(result);
        res.redirect("/profile");
      });
    });
  }
  else{
    res.redirect("/login");
}  
  });


//to update profile
  app.post("/updateProfile", function(req, res){
    if(req.isAuthenticated()){
      console.log(req.body.name, req.body.phone, req.body.prn, req.body.walink );
      Info.updateMany({email : req.user.username}, {$set: {name: req.body.name, phone: req.body.phone, prn : req.body.prn, walink: req.body.walink}}, {multi:true}, function(err, post){
        if(err) console.log(err);
        else res.redirect("/profile");
      });
    }
    else{
      res.redirect("/login");
    }
  });

  
  
  app.listen(3000, function() {
    console.log("Server started on port 3000.");
  });




  