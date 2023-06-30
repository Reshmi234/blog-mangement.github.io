const mongoose= require('mongoose')
const connection_string = 'mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + 
'@cluster0.uxs4gwb.mongodb.net/' + process.env.DB_NAME + '?retryWrites=true&w=majority';




let option={
    auth:{
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    },
    useNewUrlParser: true,
    useUnifiedTopology: true
}

module.exports=()=>{
    mongoose.connect(connection_string,option)
    console.log("DB is connected");
    
}