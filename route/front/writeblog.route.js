const express= require('express')
const route= express.Router();
const writeBlogController= require('../../controller/front/writeblog.controller')
const multer =require('multer')
const path= require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/front/uploads')
         console.log(req.file, 'file');
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
route.get('/list-blog',writeBlogController.frontAut, writeBlogController.listblog)
 //route.get('/single-page/:id',writeBlogController.frontAut, writeBlogController.viewSinglePage)
route.get('/write-blog',writeBlogController.frontAut, writeBlogController.writeBlog)
 route.post('/create-blog', upload.single('image'),writeBlogController.createBlog)
 route.get('/edit-blog/:id',writeBlogController.frontAut, writeBlogController.editBlog)
 route.post('/update',upload.single('image'), writeBlogController.updateBlog)
 route.get('/view-blog/:id',writeBlogController.frontAut,writeBlogController.viewBlog)
 route.get('/delete-blog/:id',writeBlogController.frontAut,writeBlogController.deleteBlog)

 
module.exports= route