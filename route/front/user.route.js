const express= require('express')
const route= express.Router();
const userControlle = require('../../controller/front/user.controller')
const multer= require('multer')
const path= require('path')
 

const storage= multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'./public/front/uploads')
    console.log(file,'file');
    
  },
  filename:(req,file,cb)=>{
    cb(null, file.fieldname + '-' + Date.now() + 'my_img' + path.extname(file.originalname))
  }
});
const max_size= 1024*1024
const upload=multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.filename == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/svg') {
        cb(null, true)
    } else {
        cb(null, false);
        return cb(new error('only jpg,jpeg,png and svg file allowed'));
    }
},
limits: max_size

});




route.get('/registration-page', userControlle.registration)
  route.post('/user-register',upload.single('image') ,userControlle.userRegister)
  route.get('/user-signin', userControlle.singinPage)
  route.post('/signin', userControlle.singIn)
 


  route.get('/log-out', userControlle.logout)

module.exports= route