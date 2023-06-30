const WriteBlog= require('../../model/writeblog.model')
const User= require('../../model/user.model')
//const Category =require('../../model/category.model')
const mongoose= require('mongoose')


class WriteBlogController{

    /**
     * @Method list Blog
     * @Description To Show The Listing
    */

async listBlog(req,res){

    try{
          
        let blog_details = await WriteBlog.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: ['$isDeleted', false] },
                            
                           
                        ]
                    }
                }
            },
            
            {
                $lookup: {
                    from: 'users',
                    let: {
                        user_id: '$user_id',
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$user_id'] },
                                        { $eq: ['$isDeleted', false] },
                                        { $eq: ['$status',  'Active'] },
                                       
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                full_name: 1
                           }
                        },
                    ],
                    as: 'user_details',
                }
            },
            {
                $unwind: '$user_details'
            },
            {
                $project: {
                    user_details:1,
                    heading: 1,
                    description: 1,
                    image:1,
                    status:1
                    
                    
                   
                }
            },
            {
                $sort: { 'createdAt': -1 }
            }
                          
              
           
        ])


         

          

    

// console.log(blog_details,"pawan");



let user_details = await User.findOne({ _id: req.user.id });
    //console.log(user_details);
    
    res.render('list-blog', {
        title: "List",
        blog_details,
        user_details,
        success_message: req.flash('success_message'),
        error_message: req.flash('error_message'),
    })
} catch (err) {
    throw err;
}
}


/**
 * @Method Status Change
 * @Description Status Change
 */
async statusChange(req,res){

    try{
        
        let user_data = await WriteBlog.findById(req.params.id)
     
       let updated_status= user_data.status==='Active' ? 'Inactive': 'Active';
       
       let update_data = await WriteBlog.findByIdAndUpdate(req.params.id,{ status:updated_status})
  
           if(!_.isEmpty(update_data)&&update_data._id){
            req.flash('success_message', 'Status Change successfully!');
                         
            return res.redirect('/blog-details/list-blog');
    
           }else{
            req.flash('error_message', 'Something went wrong!');
                
            return res.redirect('/blog-details/list-blog');
    
           }
    }catch(err){
        throw err
    }
       
}

/**
 * @Method delete blog
 * @Description delete blog
 */


 async deleteBlog(req,res){
     let delete_blog= await WriteBlog.findByIdAndUpdate(req.params.id, { isDeleted: true })
// console.log(delete_blog);

     if(!_.isEmpty(delete_blog)){
        console.log("data is deleted");
        
       res.redirect('/blog-details/list-blog');

     }
     else{
        req.flash('error_message', 'Something went wrong!');
        return res.redirect('/blog-details/list-blog');   

     }
 }

}
module.exports = new WriteBlogController()