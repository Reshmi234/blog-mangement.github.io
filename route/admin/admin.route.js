const express =require('express');
const route = express.Router();
const adminController= require('../../controller/admin/admin.controller')
const multer =require('multer')
const path= require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/admin/uploads')
         console.log(file, 'file');                       
    },

    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + 'my_img' + path.extname(file.originalname))
    }
});
const max_size = 1024 * 1024;
const upload = multer({
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




route.get('/registration-page',adminController.rigisterPage)
route.post('/registration',upload.single('image'),adminController.registerInsert)
route.get('/',adminController.loginPage)
route.get('/dashboard',adminController.userAuth,adminController.dashboard)
route.post('/log-in',adminController.logIn)
route.get('/log-out',adminController.logout)
route.get('/profile-edit',adminController.userAuth,adminController.profile)
route.post('/profile-update',adminController.profileUpdate)
route.get('/change-password',adminController.userAuth,adminController.changePassword)
route.post('/password-update',adminController.passwordUpdate)
route.get('/forget-password',adminController.forgetPassword)

route.post('/forget-password-update',adminController.forgetPasswordUpdate)

route.get('*',adminController.rigisterPage)
    







module.exports = route;
