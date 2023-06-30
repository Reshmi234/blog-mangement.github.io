
const Category =require('../../model/category.model')
const User = require('../../model/user.model')
const bcrypt = require("bcryptjs");
const jwt= require('jsonwebtoken')
const Mailer= require('../../config/mailer')
const fs = require('fs');
const randomstring = require('randomstring')



class CategoryController{
   

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
     * @Methodbutton  list Cetegory
     * @Description to show list Category
     */

    async listCategory(req,res){
        try{

    let user_details = await User.findOne({ _id: req.user.id });
    let all_category = await Category.find({isDeleted:false,status:'Active'}).sort({createAt:-1})
            res.render('list-category',{
                title: "List Category",
                user_details,
                all_category,
   
                success_message: req.flash('success_message'),
                error_message: req.flash('error_message')
           
            })
        }catch(err){
            throw err
        }
    }
 

 /**
     * @Methodbutton  Add Cetegory
     * @Description to show Add Category
     */

     async addCategory(req,res){
         try{

     let user_details = await User.findOne({ _id: req.user.id });
             res.render('add-category',{
                 title: "Add Category",
                 user_details,
                 success_message: req.flash('success_message'),
                 error_message: req.flash('error_message')
            
             })
         }catch(err){
             throw err
         }
     }


      /**
     * @Methodbutton  Add Cetegory
     * @Description to show Add Category
     */

    async createCategory(req,res){
   

    try {

        if (_.isEmpty(req.body.category_name.trim())) {
            req.flash('error_message', 'Category name should not be empty!');
            return res.redirect('/category/add-category');

        }



        let is_cat_exist= await Category.findOne({category_name:req.body.category_name,isDeleted:false})
        if(!_.isEmpty(is_cat_exist)){
            req.flash('error_message', 'Category Name is Allready exist Try Another Name!');
            return res.redirect('/category/add-category');

        }
        

        let save_category = await Category.create(req.body);
        if (!_.isEmpty(save_category) && save_category._id) {
            req.flash('success_message', 'Category added successfully!');
           
            return res.redirect('/category/list-category');
        } else {
            req.flash('error_message', 'Something went wrong!');
            
            return res.redirect('/category/add-category')
     }

    } catch (err) {
        throw err;
    }
    }
/**
     * @Method sattus-change banner
     * @Description To Show status-cahnge banner
     */
    async statusCategory(req,res){

        try{
            let user_data = await Category.findById(req.params.id)
            //console.log(user_data);
           let updated_status= user_data.status==='Active' ? 'Inactive': 'Active';
           let update_data = await Category.findByIdAndUpdate(req.params.id,{ status:updated_status})
           console.log(update_data);
           if(!_.isEmpty(update_data)&&update_data._id){
            req.flash('success_message', 'Status Change successfully!');
                         
            return res.redirect('/category/list-category');
    
           }else{
            req.flash('error_message', 'Something went wrong!');
                
             return res.redirect('/category/list-category');
           }
        }catch(err){
            throw err
        }
           
    
    }

     /**
     * @Method deleted Deleted
     * @Description To Show deleted banner
     */
  async deleteCategory(req,res){
    try{
    
      let deleted_cat= await Category.findByIdAndUpdate(req.params.id,{isDeleted:true})
      //onsole.log(deleted_cat);
      if(!_.isEmpty(deleted_cat)){
          req.flash('success_message', 'Category deleted successfully!');
                   
          return res.redirect('/category/list-category');

      }
      else {
          req.flash('error_message', 'Something went wrong!');
          
          return res.redirect('/category/list-category');
   }

    }catch(err){
        throw err

    }
}


}


module.exports = new CategoryController();