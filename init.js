const mongoose=require("mongoose");
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


const chatSchema=new mongoose.Schema(
    {
        from:
        {
            type:String,
            required:true
        },
        to:
        {
            type:String,
        },
        message:
        {
            type:String,
            maxLength:50,
            minLength:1
        },
        created_at:
        {
            type:Date,
            required:true
        }
    }
);

const Chat= mongoose.model("Chat",chatSchema);

Chat.insertMany([{
    from:"Sanjay",
    to:"Nimrah",
    message:"Hello World",
    created_at:new Date()
    },
    {
        from:"Bharadwaj",
    to:"Neha",
    message:"Hello World",
    created_at:new Date()
    },
    {
        from:"Jacinth",
    to:"naziya",
    message:"Hello World",
    created_at:new Date()
    }
]);