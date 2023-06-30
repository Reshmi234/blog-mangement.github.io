const mongoose= require('mongoose')
const bool_val=[true,false]
const status_enum=["Active","Inactive"]

const blogSchema = mongoose.Schema({

 category_id: { type: mongoose.Schema.ObjectId, required: true, ref: 'category' },
  user_id: { type: mongoose.Schema.ObjectId, required: true, ref: 'user' },
  date: { type: Date, required: true ,default: Date.now()},
   heading:{type:String, required:'true'},
   description:{type:String, required:'true'},

  image:{ type:String, required:true}, 

 isDeleted:{type:Boolean,default:false,enum:bool_val},
 status: { type: String, default: "Active", enum: status_enum },

},{
    timeStamps:true,versionKey:false
})
module.exports = mongoose.model('writeblog',blogSchema)