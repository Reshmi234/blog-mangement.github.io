
const FAQ= require('../../model/faq.model')
const User = require('../../model/user.model')
const bcrypt = require("bcryptjs");
const jwt= require('jsonwebtoken')
const Mailer= require('../../config/mailer')
const fs = require('fs');
const randomstring = require('randomstring')
class FaqController{


      /**
     * @Methodbutton user Auth
     * @Description user Auth
     */

    async userAuth(req, res, next) {
        try {
            // console.log(req.user,"Reshmi");
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
     * @Method Add FAQ
     * @Description To Show Add FAQ
     */

     async listFaq(req,res){
         try{
            let user_details = await User.findOne({ _id: req.user.id });
            let all_data = await FAQ.find()
             res.render('faq',{
                 title:'FAQ',
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
     * @Method Add FAQ
     * @Description To Show Add FAQ
     */

    async addFaq(req,res){
        try{
            let user_details = await User.findOne({ _id: req.user.id });
            res.render('add-faq',{
                title:'ADD-FAQ',
                user_details, 
                success_message: req.flash('success_message'),
                error_message: req.flash('error_message')
               
               
            })

        }catch(err){
            throw err
        }

        

    }

           /**
     * @Method Add FAQ
     * @Description To Show insert FAQ
     */

    async inserFaq(req,res){
        try{
           let save_faq= await FAQ.create(req.body)
        //    console.log(save_faq);
           
           if(!_.isEmpty(save_faq)&&save_faq.id){
            req.flash('success_message', 'data addes sucessfully');
            res.redirect('/faq-mangement');

           }
           else {
            req.flash('error_message','someting worng');
            res.redirect('/faq-mangement');

        }

        }catch(err){
            throw err
        }

        

    }



           /**
     * @Method Status Change
     * @Description To Show Status Change
     */

    async statusChange(req,res){
        try{
          
    
        let user_data = await FAQ.findById(req.params.id)
        console.log(user_data);
       let updated_status= user_data.status==='Active' ? 'Inactive': 'Active';
       let update_data = await FAQ.findByIdAndUpdate(req.params.id,{ status:updated_status})
    //    console.log(update_data);
       if(!_.isEmpty(update_data)&& update_data._id){
           res.redirect('/faq-mangement')
       }
        
           
        }catch(err){
            throw err
        }

        

    }


     /**
     * @Method Edit FAQ
     * @Description To Show Edit FAQ
     */

    async editFqa(req,res){
        try{
            let response= await FAQ.findById(req.params.id)
            let user_details = await User.findOne({ _id: req.user.id });
            res.render('edit-faq',{
                title:'Edit-FAQ',
                response,
                user_details, 
                success_message: req.flash('success_message'),
                error_message: req.flash('error_message')
               
               
            })

        }catch(err){
            throw err
        }

        

    }
 /**
     * @Method update FAQ
     * @Description To Show update FAQ
     */
async updateFqa(req,res){
    try {
        if (_.isEmpty(req.body.question.trim())) {
            req.flash('error_message', 'Question should not be empty!');
           return res.redirect('/faq-mangement')
        }

        if (_.isEmpty(req.body.answer.trim())) {
            req.flash('error_message', 'Answer should not be empty!');
            return res.redirect('/faq-mangement')
        
        }
        let exist_question = await FAQ.find({ question: req.body.question, _id: { $ne: req.body.id } })

        if (!_.isEmpty(exist_question)) {
            req.flash('error_message', 'Question already exist')
            return res.redirect('/faq-mangement')
        
        } else {
            let exist_answer = await FAQ.find({ answer: req.body.answer, _id: { $ne: req.body.id } })

            if (!_.isEmpty(exist_answer)) {
                req.flash(' error_message', 'Answer already exist')
                return res.redirect('/faq-mangement')
            }
            else {
                let update_obj = {
                    question: req.body.question,
                    answer: req.body.answer
                }
                console.log(update_obj);
                
                let updated_faq = await FAQ.findByIdAndUpdate(req.body.id, update_obj)
                if (!_.isEmpty(updated_faq) && updated_faq._id) {
                    req.flash('success_message', 'FAQ updated successfully')
                    return res.redirect('/faq-mangement')

                } else {
                    req.flash('error_message', 'FAQ not updated')
                    return res.redirect('/faq-mangement')

                }
            }
        }



 

    } catch (error) {
        return error
    }
}
         /**
     * @Method Delete FAQ
     * @Description To Show Delete FAQ
     */

async deleteFqa(req,res){
    let delete_faq= await FAQ.findByIdAndUpdate(req.params.id, { isDeleted: true })
// console.log(delete_blog);

    if(!_.isEmpty(delete_faq)){
       console.log("data is deleted");
       
       return res.redirect('/faq-mangement')

    }
    else{
       req.flash('error_message', 'Something went wrong!');
       return res.redirect('/faq-mangement')  

    }
    


}
   /**
     * @Method Delete FAQ
     * @Description To Show Delete FAQ
     */

     async viewFaq(req,res){
         try{
            let user_details = await User.findOne({ _id: req.user.id });
        let faq_details= await FAQ.findById({_id:req.params.id})
            res.render('view-faq',{
                title:'view-faq',
                user_details, 
                faq_details,
                success_message: req.flash('success_message'),
                error_message: req.flash('error_message')
                
               
               
            })

         }catch(err){
             throw err
         }
     }


}


module.exports =  new FaqController()