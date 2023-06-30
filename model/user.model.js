const mongoose= require('mongoose')
const bool_val=[true,false]
const status_enum=["Active","Inactive"]

const UserSchema = mongoose.Schema({
   first_name:{type:String, default:''},
  last_name:{type:String, default:''},
  full_name:{type:String, default:''},
  email:{type:String, default:'' },
  password:{type:String, default:''},
  gender:{type:String, default:''},
  address:{type:String, default:''},
  image:{ type:String ,default:''},
  role: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'role'},
 isDeleted:{type:Boolean,default:false,enum:bool_val},
 status: { type: String, default: "Active", enum: status_enum },
//  token:{type:String, default:''}
},{
    timeStamps:true,versionKey:false
})
module.exports = mongoose.model('user',UserSchema)