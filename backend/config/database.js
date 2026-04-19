const mongoose=require('mongoose');
const dotenv=require('dotenv');

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.database_url);    
        console.log('Database connected successfully');
    }catch(err){
        console.error('Database loading error',err);
    }
}

module.exports={connectDB};