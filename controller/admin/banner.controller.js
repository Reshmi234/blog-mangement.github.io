const User= require('../../model/user.model')
const Banner= require('../../model/banner.model')
const fs = require('fs');
const bcrypt = require("bcryptjs");
const jwt= require('jsonwebtoken')
const Mailer= require('../../config/mailer')

const randomstring = require('randomstring')

class BannerController {


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
                res.redirect('/admin/show-logpage')
            }
  
        } catch (err) {
            throw err
        }
    }

 /**
      
     * @Mehod List 
     * @Descriptin To show list
     */
    async listBanner(req,res){
        try{
           let user_details = await User.findOne({ _id: req.user.id });
           let all_data = await Banner.find({isDeleted:false, status:"Active"}).sort({createAt:-1})
            res.render('list-banner',{
                title:'list',
                user_details,
                all_data,

                success_message: req.flash('success_message'),
                error_message: req.flash('error_message')
               
            })

        }catch(err){
            throw err
        }

        

    }

      /**
     * @Method Add banner
     * @Description To Show Add banner
     */

    async addBanner(req,res){
        try{
            let user_details = await User.findOne({ _id: req.user.id });
            res.render('add-banner',{
                title:'ADD-Banner',
                user_details, 
                success_message: req.flash('success_message'),
                error_message: req.flash('error_message')
               
               
            })

        }catch(err){
            throw err
        }

        

    }


     /**
     * @Method Add banner
     * @Description To Show Add banner
     */

    async createBanner(req, res) {
        
    try {



                      //console.log(req.file);
                      //console.log("before", req.body);
                    req.body.image = req.file.filename
                    //console.log("after", req.body);
                    let save_banner = await Banner.create(req.body);
                    if (!_.isEmpty(save_banner) && save_banner._id) {
                        req.flash('success_message', 'Banner added successfully!');
                     
                        return res.redirect('/banner/list-banner');
                    } else {
                        req.flash('error_message', 'Something went wrong!');
                        
                        return res.redirect('/banner/add-banner')
                 }
          
      } catch (err) {
          return err;
      }
  }



        


    /**
     * @Method deleted banner
     * @Description To Show delete banner
     */
  async deleteBanner(req,res){
      try{
      
        let deleted_banner= await Banner.findByIdAndUpdate(req.params.id,{isDeleted:true})
        //console.log(deleted_banner);
        if(!_.isEmpty(deleted_banner)){
            req.flash('success_message', 'Banner deleted successfully!');
                     
            return res.redirect('/banner/list-banner');

        }
        else {
            req.flash('error_message', 'Something went wrong!');
            
            return res.redirect('/banner/list-banner')
     }

      }catch(err){
          throw err

      }
  }
      
/**
     * @Method sattus-change banner
     * @Description To Show status-cahnge banner
     */
async statusBanner(req,res){

    try{
        let user_data = await Banner.findById(req.params.id)
       // console.log(user_data);
       let updated_status= user_data.status==='Active' ? 'Inactive': 'Active';
       let update_data = await Banner.findByIdAndUpdate(req.params.id,{ status:updated_status})
       console.log(update_data);
       if(!_.isEmpty(update_data)&&update_data._id){
        req.flash('success_message', 'Status Change successfully!');
                     
        return res.redirect('/banner/list-banner');

       }else{
        req.flash('error_message', 'Something went wrong!');
            
        return res.redirect('/banner/list-banner')
 
       }
    }catch(err){
        throw err
    }
       

}
/**
     * @Method Edit banner
     * @Description To Show Edit banner
     */
    async editBannner(req,res){
        try{
            let user_details = await User.findOne({ _id: req.user.id });
            let response= await Banner.findById(req.params.id)
          res.render('edit-banner',{
              title:"Edit-Banner",
              user_details,
              response,
              success_message: req.flash('success_message'),
                error_message: req.flash('error_message')
          })
        }catch(err){
            throw err
        }

    }


    /**
     * @Method Edit banner
     * @Description To Show Edit banner
     */
    async updatedBannner(req,res){
        try{
       
            // if (_.isEmpty(req.body.heading.trim())) {
            //     req.flash('error_message', 'heding should not be empty empty!');
               
            //     return res.redirect('/banner/list-banner')
            // }

            let banner_obj={
                heading: req.body.heading,
                       
              text: req.body.text
            }

            let user_data= await Banner.findOne({_id:req.body.id })
            if (!_.isEmpty(req.file)) {
                req.body.image = req.file.filename;

                fs.unlinkSync(`./public/admin/uploads/${user_data.image}`);
                update_obj.image = req.file.filename;

            }

            let update_data = await Banner.findByIdAndUpdate(req.body.id, banner_obj);
            //console.log(update_data)
            if (!_.isEmpty(update_data)) {
                req.flash('success_message', 'data is updated!');
               
                return res.redirect('/banner/list-banner')
            } else {
                req.flash('error_message', 'something error!');
               
                return res.redirect('/banner/list-banner')

            }

        }catch(err){
            throw err
        }

    }
    
    

}









module.exports = new BannerController()