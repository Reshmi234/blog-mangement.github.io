const nodemailer =require('nodemailer')



class GmailMailer {
    constructor(){

    }
    async sendMail(from, to, subject, html){
        try{
               
            let transporter = nodemailer.createTransport({
              service :'gmail',
              auth:{
                  user:process.env.GAMIL_APP_EMAIL,
                  pass: process.env.GMAIL_APP_PASSWORD,
                  admin:process.env.ADMIN_MAIL
              },
              
            })
            
            let mailOption={
                from,
                to,
                subject,
                html,
               
             
            }
          
            return await transporter.sendMail(mailOption);
        }catch(err){
            throw err
        }
    }
}
module.exports =new  GmailMailer()