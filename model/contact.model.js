const mongoose= require('mongoose')
const bool_val=[true,false]
const status_enum=["Active","Inactive"]

const contactSchema = mongoose.Schema({
name:{type:String, required:true},
date: { type: Date, required: true ,default: Date.now()},
  email:{type:String, required:true },
 
  subject:{ type:String, required:true},
  message:{ type:String, required:true},

 isDeleted:{type:Boolean,default:false,enum:bool_val},
 status: { type: String, default: "Active", enum: status_enum },

},{
    timeStamps:true,versionKey:false
})
module.exports = mongoose.model('Contact',contactSchema)