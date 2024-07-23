const mongoose=require('mongoose');

const connectDb=async()=>{
    try{
        const connect=await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Database connection established",
            connect.connection.host,
            connect.connection.name
        );
    }
    catch(error){
        console.error("Error connecting to the database", error);
        process.exit(1);
    }
}
module.exports=connectDb;