
const Contact= require('../../model/contact.model')
const User = require('../../model/user.model')


class ContactController{
/**
 * 
 * @Method Contact List
 * @Description To  show contact list
 */
async  listContact(req,res){
    try{

 let user_details = await User.findOne({ _id: req.user.id });
  let contact_detalis= await Contact.find({isDeleted:false}).sort({createdAt:-1})
  res.render('list-contact',{
      title:'List',
      user_details,
      contact_detalis,
      success_message: req.flash('success_message'),
      error_message: req.flash('error_message')
  })

    }catch(err){
        throw err
    }
    

}
/**
 * 
 * @Method Deleted Contact
 * @Description To  show Deleted contact 
 */
async  deleteContact(req,res){
    try{

        let exist_contact= await Contact.findByIdAndUpdate(req.params.id,{isDeleted:true})
    if(!_.isEmpty(exist_contact)){
        req.flash('success_message', 'Contact Deleted Successfully')
        return res.redirect('/contact/list-contact');

    }else{
        req.flash('error_message', 'something worng')
        return res.redirect('/contact/list-contact');
    }
 

    }catch(err){
        throw err
    }
    

}


}


module.exports= new ContactController()