const Role = require('../../model/role.model')
const User = require('../../model/user.model')
const fs= require('fs')
const bcrypt = require("bcryptjs");
const jwt= require('jsonwebtoken')
const Mailer= require('../../config/mailer')
const os =require('os')
const randomString = require('randomstring')

class AdminController{

    /**
     * @Methodbutton user Auth
     * @Description user Auth
     */

    async userAuth(req, res, next) {
      try {
         //console.log(req.user,"Reshmi");
          if (!_.isEmpty(req.user)) {
              next();
          }
          else {
              res.redirect('/admin')
          }

      } catch (err) {                                      
          throw err
      }
  }



    
  /**
     * @Methodbutton rigisterPage
     * @Description To Show button 
     */
    
    async rigisterPage(req,res){
      try{
      //  let role_detail= await Role.findOne({role_group: 'admin'})
      let role_detail= await Role.find()
      console.log(role_detail);
      
         res.render('register',{
            title: "Register",
            //  role_detail,
            success_message: req.flash('success_message'),
            error_message: req.flash('error_message')
         })
      }catch(err){
         console.log(err);
      }
  }

  /**
     * @Methodbutton rigisterPage
     * @Description To admin re gister 
     */
    async registerInsert(req,res){
       try{
     
          //console.log(req.body);
          let check_email = await User.find({ email: req.body.email });
          if (!_.isEmpty(check_email)) {
              req.flash('error_message', 'Email is allerdy exist!');
              return res.redirect('/admin');
          }
       
      
          if(req.body.password!= req.body.confirm_password){
            req.flash(' error_message', 'confirm Password is not match!!!!')
            return res.redirect('/admin')
          }

         // req.body.full_name= `${req.body.first_name} ${req.body.last_name}`
         req.body.full_name= req.body.first_name+ ''+req.body.last_name
          console.log(req.body,'10101');
         let role = await Role.findOne({role_group: 'admin'})
         console.log(role,'rollls');
         req.body.role = role._id
          console.log(req.body,"RK...");   
          req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
          // req.body.image = req.file.filename; 
          console.log(req.body,"Rkkk");
 
           

           let save_data = await User.create(req.body)
           //console.log(save_data);
         
                 
         //   let is_mail_send = await Mailer.sendMail('reshureshmi234@gmail.com',save_data.email,"Registration Successfully Done",
         //   "Successfully Registration Completed!!!")
         //   console.log(is_mail_send);
           
           if (!_.isEmpty(save_data) && save_data._id) {
               req.flash('success_message', 'Registration successfully done!');
               return res.redirect('/admin');
           }
           else{
            req.flash('error_message', 'something wrong!');
            return res.redirect('/admin');

           }

       }catch(err){
          throw err
       }
   }
 


  /**
     * @Methodbutton loginPage
     * @Description To Show loginPage
     */
    
    async loginPage(req,res){
    
         // let role_detail= await Role.find({role_group:'admin'})
         // console.log(role_detail);
   
         try {
            res.render('login', {
                title: "Log-In Form",
                success_message: req.flash('success_message'),
                error_message: req.flash('error_message')
            })
        } catch (err) {
            throw err
        }
    }

  /**
     * @Methodbutton Login
     * @Description To Login
     */

async logIn(req, res) {
   try {
      console.log(req.body);
       let is_user_exist = await User.findOne({
           email: req.body.email
       });
       let role_details= await Role.findOne({role_group:'admin'})
       if(is_user_exist.role.toString()=== role_details._id.toString()){
         console.log(is_user_exist);
         if (!_.isEmpty(is_user_exist)) {
           
             const hash_password = is_user_exist.password
             if (bcrypt.compareSync(req.body.password, hash_password)) {
               
                 const token = jwt.sign({
                     id: is_user_exist._id,
                     email: is_user_exist.email,
  
                 }, 'RPAWEE12SH3', { expiresIn: '1d' })
                 console.log(token);
                 res.cookie("user_token", token)
                 
                 res.redirect('/admin/dashboard')

          let is_mail_send = await Mailer.sendMail('reshureshmi234@gmail.com',is_user_exist.email,"Log in Sucessfully",
          "new login"+os.type())
          
           
           //console.log(is_mail_send);
         
               
  
             }
             else {
               req.flash('error_message', 'Password is not match');
               return res.redirect('/admin');
             }
         } else {
            req.flash('error_message', 'email                                                                             is not match');
            return res.redirect('/admin');
  
         }

       }
      
   } catch (err) {
       throw err
   }
}

   /**
     * @Method ShowAdminPage
     * @Description To Show Admin Pannel
     */
    
       async dashboard(req, res) {
      try {

     let user_details = await User.findOne({ _id: req.user.id });
          res.render('dashbord', {
               user_details,
              title:"Dashboard"
          })

      } catch (err) {
          throw err
      }
  }

  
   /**
     * @Method Log out
     * @Description To Show Log Out
    
  */
 async logout(req, res) {
   try {
       res.clearCookie('user_token');
       res.redirect('/admin')
   } catch (err) {
       throw err;
   }
}

 /**
     * @Methodbutton Profie Edit 
     * @Description To Show Profile Edit
     */
    
    async profile(req,res){
      try{
         let user_details = await User.findOne({ _id: req.user.id });
         res.render('profile',{
            title: "Profile Edit",
            user_details,
          
            success_message: req.flash('success_message'),
            error_message: req.flash('error_message')
         })
      }catch(err){
        throw err
      }
  }
/**
     * @Methodbutton Profie Update 
     * @Description To Show Profile UPdate
     */
    
    async profileUpdate(req,res){
      try{
         
            let update_obj={
               first_name:req.body.first_name,
               last_name:req.body.last_name,
               full_name:req.body.first_name+ ''+req.body.last_name,
               email:req.body.email
            }
            let update_data = await User.findByIdAndUpdate({ _id: req.user.id }, update_obj);
            if(!_.isEmpty(update_data)){
               req.flash('success_message', 'data updated successfully done!');
           return res.redirect('/admin/profile-edit')

            }else{
               req.flash('error_message', 'something wrong!')
               return res.redirect('/admin/profile-edit')
    

            }
        

      }catch(err){
         throw err
      }
  }
       /**
     * @Methodbutton Change Password 
     * @Description To Show Change Password 
     */
    
    async changePassword(req,res){
      try{
         let user_details = await User.findOne({_id:req.user.id})
         res.render('change_password',{
            title: "Change-Password",
                user_details,
            success_message: req.flash('success_message'),
            error_message: req.flash('error_message')
       
         })
      }catch(err){
        throw err
      }
  }

    /**
     * @Methodbutton Change Password 
     * @Description To Show Change Password 
     */
    
    async passwordUpdate(req,res){
      try{
         const {old_password,new_password,confirm_password} =req.body
         if(req.body.new_password!== req.body.confirm_password){
            req.flash('error_message', 'password is not match')
            return res.redirect('/admin')
         }
         let user =await User.findById(req.user.id)
         if(!user){
            req.flash('error_message','User is not match')
            return res.redirect('/admin')
         }
         const is_password_match = await bcrypt.compareSync(old_password,user.password)
         if(!is_password_match){
            req.flash('error_message','Old password wrong')
            return res.redirect('/admin')
         }
         let hash_password= await bcrypt.hashSync(req.body.new_password,10)
         await User. updateOne({_id:user._id},{password:hash_password})


            let is_mail_send = await Mailer.sendMail('reshureshmi234@gmail.com',user.email,"password update Successfully Done",
           "Successfully password update Completed!!!")
           console.log(is_mail_send);


         req.flash('success', 'new password is chagned is sucessfully');
         res.redirect('/admin/show-logpage');
         
      }catch(err){
         throw err
      }
  }
    /**
     * @Methodbutton Profie Edit 
     * @Description To Show Profile Edit
     */
    
    async forgetPassword(req,res){
      try{
     
        
         res.render('forgot-password',{
            title: "Forget Password",
         
           success_message: req.flash('success_message'),
            error_message: req.flash('error_message')
         })
      }catch(err){
         console.log(err);
      }
  }

/**
     * @Methodbutton Profie Edit 
     * @Description To Show Profile Edit
     */
    
                                                                             
    async forgetPasswordUpdate(req, res) {
      try {

          if (_.isEmpty(req.body.email.trim())) {
              req.flash('error', 'Email should not be empty!');
              return res.redirect('/admin/forget-password');
          }

          let user_details = await User.findOne({ email: req.body.email });

          if (_.isEmpty(user_details)) {
              req.flash('error', 'Email is not exist!');
              return res.redirect('/admin/forget-password');
          }


          let random = randomString.generate({
              length: 5,
              charset: 'alphabetic'
          });
         // console.log(random);
         
          let encrypted_pwd = await bcrypt.hashSync(random, bcrypt.genSaltSync(10));

          let  forget_pass_updated = await User.findByIdAndUpdate(user_details._id, { password: encrypted_pwd });

          if(!_.isEmpty(forget_pass_updated)&&forget_pass_updated._id){
            await Mailer.sendMail('reshureshmi234@gmail.com',user_details.email,"forget password",
           "your new password",`${random}`)
              return res.redirect('/admin/forget-password');
          } else {
              req.flash('error', 'Something went wrong!');
              return res.redirect('/admin/forget-password');
          }

      } catch (err) {
          throw err;
      }
  }


    }
    
    
    module.exports = new AdminController()












    