const Banner= require('../../model/banner.model')
const Category =require('../../model/category.model')
const Contact= require('../../model/contact.model')
const Mailer= require('../../config/mailer')
const fs= require('fs')
const bcrypt = require("bcryptjs");
const jwt= require('jsonwebtoken')

 const User= require('../../model/user.model')
 const WriteBlog= require('../../model/writeblog.model')


class FrontController {
   
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
     * @Method To show Index Page
     * @Description Index Page
     */
    async indexPage(req,res){


        try{
  
        
                
             let user_detail='';
             if(!_.isEmpty(req.user)){
                 user_detail= await User.findOne({_id:req.user.id})
             }
            //    let user_detail = await User.find()
            //    if(!_.isEmpty(req.user)){
            //     user_detail= await User.findOne({_id:req.user.id})
            //    }
            let banner_details = await Banner.find({isDeleted:false, status:"Active"})
            let all_details= await Category.find({isDeleted: false ,status:"Active"})
           
            
             let all_blogs= await WriteBlog.aggregate([
                 {
                     $match:{
                         $expr:{
                             $and:[
                                { $eq: ['$isDeleted', false] },
                                { $eq: ['$status',  'Active'] },
                            
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
                                             {$eq:['$status', 'Active']}
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
                       
                        
                    } 
                       
                    }
             ])


   //console.log(all_blogs,'00000000000000000000');
   
        //    let blogs_details= await WriteBlog.find({isDeleted:false,status:'Active'})
            
            // console.log(banner_details);
             res.render('index',{
             title: 'Index Page',
              user_detail,
             banner_details,
             all_details,
             all_blogs,
            //  user:req.user,
            
             
         })
        }catch(err){
            throw err
        }
    }


    /**
     * @Method To show About Page
     * @Description About Page
     */
    async aboutPage(req,res){
        try{
            
             
            let user_detail='';
            if(!_.isEmpty(req.user)){
                user_detail= await User.findOne({_id:req.user.id})

            }
           
            let all_details= await Category.find({isDeleted: false ,status:"Active"})
         res.render('about',{
             title: 'About Page',
             all_details,
            // user:req.user,
            user_detail
         })
        }catch(err){
            throw err
        }
    }


    /**
     * @Method To show Index Page
     * @Description Index Page
     */
    async contactPage(req,res){
        try{
            let user_detail='';
            if(!_.isEmpty(req.user)){
                user_detail= await User.findOne({_id:req.user.id})
            }
            let all_details= await Category.find({isDeleted: false ,status:"Active"})
         res.render('contact',{
             title: 'Contact Page',
             all_details,
              user_detail,
            // user:req.user,
             success_message: req.flash('success_message'),
             error_message: req.flash('error_message')
         })
        }catch(err){
            throw err
        }
    }

      /**
     * @Method To show Index Page
     * @Description Index Page
     */
    async createContact(req,res){
   try{
       //console.log(req.body);
      if(_.isEmpty(req.body.name.trim())){
          req.flash('error_message', 'name should not be empty')
          return res.redirect('/contact')
          

      }
      if(_.isEmpty(req.body.email.trim())){
        req.flash('error_message', 'email should not be empty')
        return res.redirect('/contact')
        

    }
    if(_.isEmpty(req.body.subject.trim())){
        req.flash('error_message', 'subject should not be empty')
        return res.redirect('/contact')
        

    }

    if(_.isEmpty(req.body.message.trim())){
        req.flash('error_message', 'subject should not be empty')
        return res.redirect('/contact')
        

    }
    let is_exist_email= await Contact.find({email:req.body.email})
    if(!_.isEmpty(is_exist_email)){
        req.flash('error_message', 'email is allready exist')
        return res.redirect('/contact')

    }
   else{
    let save_data= await Contact.create(req.body)
    if(!_.isEmpty(save_data)&& save_data._id){

        let is_mail_send= await Mailer.sendMail('reshureshmi234@gmail.com',
        save_data.email,'contact save',
        'you sucessfully save your contact!!!!')
        console.log(is_mail_send);
        
    
        req.flash('success_message', 'Contact add Succefully')
        return res.redirect('/contact')
       

    }

   }
      
       

   }catch(err){
       throw err
   }


       
            
    }



    /**
     * @Method To show Category Page
     * @Description category Page
     */
    async categoryPage(req,res){
        try{
     
            let user_detail='';
            if(!_.isEmpty(req.user)){
                user_detail= await User.findOne({_id:req.user.id})
            }
        let all_details= await Category.find({isDeleted: false ,status:"Active"}).sort({createdAt:-1})
        let category_data= await Category.findById({_id:req.params.id})
        console.log(category_data,'pppppppppppppppppppppppppppp');
        
      
        let all_blogs = await WriteBlog.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: ['$category_id', category_data._id]},

                            { $eq: ['$isDeleted', false] },
                            { $eq: ['$status', "Active"] },

                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    let: {
                        category_id: '$category_id'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$category_id'] },
                                        { $eq: ['$isDeleted', false] }

                                    ]
                                }
                            }
                        },
                        {
                            $project:{
                               category_name:1
                            }
                        },

                        {
                            $project: {
                                isDeleted: 0,
                                updatedAt: 0,
                                createdAt: 0
                            }
                        }
                    ],
                    as: 'category_details',
                },

            },
            {
                $lookup: {
                    from: 'users',
                    let: {
                        user_id: '$user_id'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$user_id'] },
                                        { $eq: ['$isDeleted', false] }

                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                               
                                isDeleted: 0,
                                updatedAt: 0,
                                createdAt: 0
                            }
                        }
                    ],
                    as: 'user_details',
                }
            },
            {
                $unwind: '$user_details'

            },

            {
                $unwind: '$category_details'
            },

        ]);  


//console.log(all_blogs);

  
        // console.log(all_details);
        //let all_category = await Category.findById({ _id: req.params.id });
         res.render('category',{
             title: 'Category Page',
            
            
             category_data,
            
            user_detail,
             all_details,
           
            all_blogs
            
         })
        }catch(err){
            throw err
        }
    }



    /**
     * @Method To show Category Page
     * @Description category Page
     */


    /**
     * @Method To show single Page
     * @Description single Page
     */

     async detailsPage(req,res){
         try{
            let user_detail='';
            if(!_.isEmpty(req.user)){
                user_detail= await User.findOne({_id:req.user.id})
            }
        let all_details= await Category.find({isDeleted: false ,status:"Active"}).sort({createdAt:-1})
             let single_page= await WriteBlog.findById({_id:req.params.id})
           res.render('single-page',{
               title:"Single Page",
               user:req.user,
               single_page,
               all_details,
            user_detail
           })
         }catch(err)
       {
           throw err
       }
     }

//     async categoryBlog(req,res){

//         try{
     
   
            
     
           
//              res.render('category-blog',{
//                  title: 'category-blog',
//                  all_details,
//                  all_blogs,
              
//                  user:req.user
                
//              })
//             }catch(err){
//                 throw err
          

//     }
// }
 /**
     * @Method To show Single Page
     * @Description single Page
     */
    async singlePage(req,res){
        try{
            let user_detail='';
            if(!_.isEmpty(req.user)){
                user_detail= await User.findOne({_id:req.user.id})
            }
            let all_details= await Category.find({isDeleted: false ,status:"Active"})
         res.render('single-post',{
             title: 'Single Post',
             all_details,
           user_detail,
             //user:req.user,
         })
        }catch(err){
            throw err
        }
    }
/**
     * @Method To show serch Page
     * @Description Serch Page
     */
    async searchPage(req,res){
        try{
         res.render('search-result',{
             title: 'Serch Result'
         })
        }catch(err){
            throw err
        }
    }




}


module.exports= new FrontController()