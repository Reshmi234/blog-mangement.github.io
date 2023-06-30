

const User = require('../../model/user.model')


class UserController{
/**
 * 
 * @Method Contact List
 * @Description To  show contact list
 */
async  listuser(req,res){
    try{

 let user_details = await User.findOne({ _id: req.user.id }).sort({createdAt: -1});
  let user_data= await User.find({isDeleted:false}).sort({createdAt: -1})
  res.render('list-user',{
      title:'List',
      user_details,
      user_data,
     
  })

    }catch(err){
        throw err
    }
    

}

      /**
     * @Method sattus-change user
     * @Description To Show status-cahnge user
     */
    async statusUser(req,res){

        try{
            let user_data = await User.findById(req.params.id)
            // console.log(user_data);
           let updated_status= user_data.status==='Active' ? 'Inactive': 'Active';
           let update_data = await User.findByIdAndUpdate(req.params.id,{ status:updated_status})
           console.log(update_data);
           if(!_.isEmpty(update_data)&&update_data._id){
               
            req.flash('success_message', 'Status Change successfully!');               
            return res.redirect('/user-details/list-user');
    
           }else{
            req.flash('error_message', 'Something went wrong!');
                
             return res.redirect('/user-details/list-user');
           }
        }catch(err){
            throw err
        }
           
    
    } 
    
    
    /**
     * @Method deleted banner
     * @Description To Show delete banner
     */
  async deleteUser(req,res){
    try{
    
      let deleted_user= await User.findByIdAndUpdate(req.params.id,{isDeleted:true})
    //   console.log(deleted_user);
      if(!_.isEmpty(deleted_user)){
          req.flash('success_message', 'user deleted successfully!');
                   
          return res.redirect('/user-details/list-user');

      }
      else {
          req.flash('error_message', 'Something went wrong!');
          return res.redirect('/user-details/list-user');
   }

    }catch(err){
        throw err

    }
}
    
  

}


module.exports= new UserController()