const express=require("express");
const path=require("path");
const app=express();
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const {Chat}=require("./models/chats.js");
const ExpressError=require("./ExpressError.js");
let port=3000;


async function main()
{
    await mongoose.connect("mongodb://127.0.0.1:27017/fakeWhatsapp");
}

main().then((success)=>
{
    console.log("im done");
})
.catch((err)=>
{
    console.log(err);
})

//testing if our imported file is working?
// let user1= new Chat({from:"Srinivas",to:"Meghana",message:"Hello World",created_at:new Date()});
// user1.save();


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views")); 
app.use(express.static(path.join(__dirname,"public")))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//starting our server
app.listen(port,()=>
{
    console.log("app is started");
});


//async Wrap Function
function asyncWrap(fn)
{
    return function(req,res,next)
    {
        fn(req,res,next).catch((err)=>{next(err);})
    }
}

//viewing all chats
app.get("/chats",asyncWrap(async (req,res,next)=>
{
    let Data=await Chat.find();
    console.log(Data)
    res.render("chats.ejs",{Data});
}));

//send new message form
app.get("/chats/new",(req,res)=>
{
    res.render("newchat.ejs")
});

//inserting the new message to db and viewing all chats
app.post("/chats",asyncWrap(async (req,res,next)=>
{
    let {from,to,message}=req.body;
    let newChat=new Chat({from:from,to:to,message:message,created_at:new Date()})
    await newChat.save()
    res.redirect("/chats");
}));

//edit message

app.get("/chats/:id/edit",asyncWrap(async (req,res,next)=>
{
    let {_id}=req.params;
    let Data=await Chat.findOne({id:_id});
    res.render("edit.ejs",{Data});
}));

//New show route
app.get("/chats/:id",asyncWrap(async (req,res,next)=>
{
    let {id}=req.params;
    console.log(id);
    let Data=await Chat.findById(id);
    if(!Data)
    {
        next( new ExpressError(500,"No chat found"));
    }
    res.render("edit.ejs",{Data});
}));



//updating the message in database

app.put("/chats/:id",asyncWrap(async (req,res,next)=>
{
    let {id}=req.params;
    let {message:newmessage}=req.body;
    // console.log(message);
    console.log(id);
    await Chat.findByIdAndUpdate(id,{message:newmessage},{runValidators:true,new : true});
    res.redirect("/chats");
}));

//deleting a message/route
app.delete("/chats/:id",asyncWrap(async (req,res,next)=>
{
    let {id}=req.params;
    console.log(id);
    await Chat.findByIdAndDelete(id);
    res.redirect("/chats");
}));

app.use((err,req,res,next)=>
{
    let {status=500,message="an unknown error occured"}=err;
    res.status(status).send(message);
});