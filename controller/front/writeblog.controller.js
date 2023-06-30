const User= require('../../model/user.model')
//const Role = require('../../model/role.model')
const fs= require('fs')
// const bcrypt= require('bcryptjs')
// const jwt= require('jsonwebtoken')
// const Mailer= require('../../config/mailer')
const Category =require('../../model/category.model')
const Banner= require('../../model/banner.model')
const WriteBlog= require('../../model/writeblog.model')
const mongoose= require('mongoose')


class WriteBlogContriller{


        /**
     * @Methodbutton user Auth
     * @Description user Auth
     */

    async frontAut(req, res, next) {
        try {
            console.log(req.user,"Reshmi");
            if (!_.isEmpty( req.user)) {
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
      * @Methodbutton write Blog
       * @Description To Show Blog
     */

     async listblog(req,res){
         try{

            let user_detail='';
            if(!_.isEmpty(req.user)){
                user_detail= await User.findOne({_id:req.user.id})
            }

                   let user_id= new mongoose.Types.ObjectId( req.user.id)
         
            // let user_details = await User.findOne({ _id: req.user.id });
             //let blog_details = await WriteBlog.find({ user_id: user_details._id, status: "Active", isDeleted: false }).sort({ createdAt: -1 });
           let all_data= await WriteBlog.aggregate([
               {
                    $match:{
                        $expr:{
                            $and:[
                               { $eq: ['$isDeleted', false] },
                               { $eq: ['$status', 'Active'] },
                                { $eq: ['$user_id',user_id ] },
                                 // { $eq: ['$user_details',user_details._id] },   

                            ]
                        }
                    }
                },
                {
                    $lookup:{
                        from:'categories',
                        let:{
                           category_id:'$category_id'
                        },
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $and:[
                                            {$eq:['$_id','$$category_id']},
                                            {$eq:['$isDeleted', false]},
                                           
                                            
                                        ]
                                    }
                                }
                            },
                            {
                                $project:{
                                   category_name:1
                                }
                            }
                        ],
                        as: 'cat_details',
                    }
                },
                {
                   $unwind: '$cat_details'
               },

               {
                   $project: {
                       cat_details:1,
                       image:1,
                       heading: 1,
                       description: 1,
                       status:1
                      
                       
                   } 
                      
                   }
            ])

              let banner_details = await Banner.find({isDeleted:false, status:"Active"})
             let all_details= await Category.find({isDeleted: false ,status:"Active"})

             res.render('mypost',{
                 title:"My-Post",
              all_details,
                all_data,
                 user_detail,
                 banner_details,
                 all_details
             })
          
         }catch(err){
             throw err
         }
     }

   
/**
     * @Methodbutton write Blog
     * @Description To Show Blog
     */

    async writeBlog(req,res){
        try{
            let user_detail='';
            if(!_.isEmpty(req.user)){
                user_detail= await User.findOne({_id:req.user.id})
            }
            let all_user = await User.find({ isDeleted: false, status: "Active" });
            let banner_details = await Banner.find({isDeleted:false, status:"Active"})
           let all_details= await Category.find({isDeleted: false ,status:"Active"})  
          res.render('writeblog',{
              title:"Write-Blog",
             all_details,
              all_user,
              banner_details,
              user_detail,
               success_message: req.flash('success_message'),
              error_message: req.flash('error_message')
          })
         
   
        }catch(err)
       {
           throw err
       }
    }


    /**
     * @Methodbutton write Blog
     * @Description To Show Blog
     */

    async createBlog(req,res){
        try{
           

            console.log(req.body)
                if (_.isEmpty(req.body.heading.trim())) {
                    req.flash('error_message', 'Please enter your heading!');
                    return res.redirect('/blog/write-blog');
                }
                if (_.isEmpty(req.body.description.trim())) {
                    req.flash('error_message', 'Please enter your description!');;
                    return res.redirect('/blog/write-blog');
                }
           
                let user_details = await User.findOne({ _id:req.user.id});
               console.log(user_details);
                req.body.user_id = user_details._id
                req.body.image = req.file.filename;
                req.body.status = 'Inactive'
    
                let save_data = await WriteBlog.create(req.body);
             
                if (save_data && save_data._id) {
                    req.flash('success_message', 'Your post created successfully')
                    return res.redirect('/blog/write-blog');
                }
                else {
                  
                    req.flash('error_message', 'something wrong')
                    return res.redirect('/blog/write-blog');
                }
            } catch (error) {
                throw error
            }
        }

 /**
     * @Methodbutton Edit Blog
     * @Description To Show  edit Blog
     */

    async editBlog(req,res){
        try{
            let user_detail='';
            if(!_.isEmpty(req.user)){
                user_detail= await User.findOne({_id:req.user.id})
            }
            let all_user = await User.find({ isDeleted: false, status: "Active" });
            let banner_details = await Banner.find({isDeleted:false, status:"Active"})
           let all_details= await Category.find({ isDeleted: false, status: "Active" })
           let response = await WriteBlog.findOne({ _id: req.params.id });
           console.log(response);
           
            res.render('edit-blog',{
                title:"Blog-Edit",
                all_user,
                banner_details,
                all_details,
                //user:req.user,
                response,
              user_detail,
                success_message: req.flash('success_message'),
             error_message: req.flash('error_message')
            })

        }catch(err){
            throw err
        }
    }
 /**
     * @Methodbutton update Blog
     * @Description To Show  update Blog
     */
    async updateBlog(req, res) {

       try {

     let exist_heading = await WriteBlog.find({ heading: req.body.heading, _id: { $ne: req.body.id },isDeleted: false })
    
            if (!_.isEmpty(exist_heading)) {
                req.flash('errerror_messageor', 'heading already exist')
                return res.redirect('/blog/list-blog' );
            
            } 
                let exist_description = await WriteBlog.find({ description: req.body.description, _id: { $ne: req.body.id },isDeleted:false })
    
                if (!_.isEmpty(exist_description)) {
                    req.flash('error_message', 'description already exist')
                    return res.redirect('/blog/list-blog');
                }
               
                    let update_obj = {
                        category_id: req.body.category_id,
                        heading : req.body.heading ,
                        description: req.body.description
                    }


                    let user_data = await WriteBlog.findOne({ _id: req.body.id })
             
                 if (!_.isEmpty(req.file)){
                    req.body.image = req.file.filename;
                    fs.unlinkSync(`./public/front/uploads/${user_data.image}`);
                    update_obj.image = req.file.filename;
                 }
                 

                    
                    let update_blogs = await WriteBlog.findByIdAndUpdate(req.body.id, update_obj);
                    console.log(update_blogs,9999999999);
                    
        if (!_.isEmpty(update_blogs)) {
            req.flash('success_message', 'blog updated successfully')
         return res.redirect('/blog/list-blog');

        }else {
                        req.flash('error_message', 'blog not updated')
                        return res.redirect('/blog/list-blog');
                    }
              
          
          

        } catch (err) {
           throw err
        }



    }


     /**
     * @Method view Blog
     * @description to view BLOG
     */

    async viewBlog(req, res) {
        try {
            let user_detail='';
            if(!_.isEmpty(req.user)){
                user_detail= await User.findOne({_id:req.user.id})
            }
            let all_user = await User.find({ isDeleted: false, status: "Active" });
            let banner_details = await Banner.find({isDeleted:false, status:"Active"})
           let all_details= await Category.find({isDeleted: false ,status:"Active"})
            let blog_details = await WriteBlog.findById({ _id: req.params.id });
            let user_details = await User.findOne({ _id: req.user.id });

            res.render('view-blog', {
                title: "view-blog",
                all_user,
                banner_details,
                all_details,
                blog_details,
             user_details,
                user_detail,
                //user:req.user,

            })
        } catch (error) {
           throw err
        }
    }


    /**
 * 
 * @Method Deleted Contact
 * @Description To  show Deleted contact 
 */
async  deleteBlog(req,res){
    try{

        let exist_Blog= await WriteBlog.findByIdAndUpdate(req.params.id,{isDeleted:true})
    if(!_.isEmpty(exist_Blog)){
        req.flash('success_message', 'Blog Deleted Successfully')
        return res.redirect('/blog/list-blog' )

    }else{
        req.flash('error_message', 'something worng')
        return res.redirect('/blog/list-blog' )
    }
 

    }catch(err){
        throw err
    }
    

}
    }

module.exports = new WriteBlogContriller()