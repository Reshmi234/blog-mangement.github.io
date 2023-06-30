
const mongoose= require('mongoose')
const bool_val= [true,false]
const status_enum = ["Active","Inactive"]




const bnnerModel= mongoose.Schema({

    heading:{type:String, required:true},
    image:{type: String, required:true},
   text:{type:String, required:true},
   isDeleted:{type:Boolean,default: false,enum:bool_val}, 
   status:{type:String,default: "Inactive", enum:status_enum}, 
           
},{
    timeStamps:true, versionKey:false
})
module.exports = mongoose.model('banner',bnnerModel)