const mongoose=require('mongoose');
const ContactSchema=mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:[true,"please add the email"],
    },
    phone:{
        type:String,
        required:[true,"please add the phone number"],
    }
},{
    timestamps: true,
});

module.exports=mongoose.model("Contact",ContactSchema);