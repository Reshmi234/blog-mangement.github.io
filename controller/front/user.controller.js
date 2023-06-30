const User= require('../../model/user.model')
const Role = require('../../model/role.model')
const fs= require('fs')
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')
const Mailer= require('../../config/mailer')
const Category =require('../../model/category.model')
const Banner= require('../../model/banner.model')

class USerController{

        /**
     * @Methodbutton user Auth
     * @Description user Auth
     */

    async frontAut(req, res, next) {
        try {
            console.log(req.front_user,"Reshmi");
            if (!_.isEmpty(  req.user)) {
                next();
            }
            else {
                res.redirect('/')
            }
  
        } catch (err) {                                      
            throw err
        }
    }
  


    /**
     * @Method Regostration
     * @Description To Show Registration
     */

     async registration(req,res){
         try{
        
      
            let role_deatils= await Role.findOne({role_group: 'user'})
            // console.log(role_deatils);
            
            res.render('singup',{
                title:'Singup',
                success_message: req.flash('success_message'),
               error_message: req.flash('error_message')
            })   

         }catch(err){
             throw err

         }
     }

  /**
     * @Method Regostration
     * @Description To Show Registration
     */

    async userRegister(req,res){
        try{
          
        //    console.log(req.body);
           
           let role_deatils= await Role.findOne({role_group: 'user'})
           //console.log(role_deatils);
         
           if (_.isEmpty(req.body.first_name.trim())) {
            req.flash(' error_message', 'first_name should not be empty!');
            res.redirect('/user/registration-page')
        }
        if (_.isEmpty(req.body.last_name.trim())) {
            req.flash(' error_message', 'last_name should not be empty!');
            res.redirect('/user/registration-page')
        }
        if (_.isEmpty(req.body.email.trim())) {
            req.flash(' error_message', 'email should not be empty!');
            res.redirect('/user/registration-page')
        }
        if (_.isEmpty(req.body.address.trim())) {
            req.flash(' error_message', 'address should not be empty!');
            res.redirect('/user/registration-page')
        }
        let check_email = await User.find({ email: req.body.email });
        if (!_.isEmpty(check_email)) {
            req.flash('error_message', 'Email is allerdy exist!');
            res.redirect('/user/registration-page')
        }
        req.body.full_name= req.body.first_name+ ''+req.body.last_name
        console.log(req.body,'10101');
       let role = await Role.findOne({role_group: 'user'})
       console.log(role,'rollls');
       req.body.role = role._id
       req.body.status= "Inactive"
       req.body.image = req.file.filename; 
      
       req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
       
    let save_data = await User.create(req.body)
        //  console.log(save_data);
       
         if (!_.isEmpty(save_data) && save_data._id) {
             req.flash('success_message', 'Registration successfully done!');
             res.redirect('/user/user-signin')
         }
         else{
          req.flash('error_message', 'something wrong!');
          res.redirect('/user/registration-page')
         }
               

        }catch(err){
            throw err

        }
    }

  /**
     * @Methodbutton loginPage
     * @Description To Show loginPage
     */
    
    async singinPage(req,res){
    
        // let role_detail= await Role.find({role_group:'admin'})
        // console.log(role_detail);
  
        try {
           res.render('signin', {
               title: "singin",
               success_message: req.flash('success_message'),
               error_message: req.flash('error_message')
           })
       } catch (err) {
           throw err
       }
   }
   /**
     * @Methodbutton loginPage
     * @Description To Show loginPage
     */
    async singIn(req, res) {
        try {

            if (_.isEmpty(req.body.email.trim())) {
                req.flash('error_message', 'Please enter your email!');
                return res.redirect('/user/user-signin');
            }
            if (_.isEmpty(req.body.password.trim())) {
                req.flash('error_message', 'Please enter password!');
                return res.redirect('/user/user-signin');
            }

            let user_exist = await User.findOne({ email: req.body.email })
            let role_details = await Role.findOne({ role_group: 'user' })

            if (_.isEmpty(user_exist)) {

                req.flash('error_message', 'email is not exist')
                return res.redirect('/user/user-signin');
            }

            if (user_exist.role.toString() === role_details._id.toString() && user_exist.status==="Active") {

                const has_password = user_exist.password

                if (bcrypt.compareSync(req.body.password, has_password)) {
                    const token = jwt.sign({ id: user_exist._id }, 'TTEH0E@YZ', { expiresIn: '1d' })
                    res.cookie("front_user_token", token);
                   
                    
                    return res.redirect('/');
                } else {
                    req.flash('error_message', 'password is not match')
                    return res.redirect('/user/user-signin');
                
                }
            } else {
                req.flash('error_message', 'something wrong')
                return res.redirect('/user/user-signin');
            }
        } catch (error) {
            throw error
        }

    }

     
     /**
     * @Methodbutton loginPage
     * @Description To Show loginPage
     */

    async logout(req, res) {
        try {
            res.clearCookie('front_user_token');
            res.redirect('/')
        } catch (err) {
            throw err;
        }
     }

}


module.exports = new USerController()