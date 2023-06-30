const express =require('express');
const route = express.Router();

const bannerController= require('../../controller/admin/banner.controller')

const multer= require('multer');
const path =require('path');

 const storage = multer.diskStorage({
     destination:(req,file,cb)=>{
         cb(null,'./public/admin/uploads');
         
         console.log(file, 'file');
     },
     filename: (req,file,cb)=>{
         cb(null, file.fieldname +'-'+ Date.now()+ '-'+  'my_img' + path.extname(file.originalname));
         
     }
 });
  const max_size = 1024*1024;

  const upload=multer({
      storage,
      fileFilter:(req,file, cb)=>{
          if(file.mimetype== 'image/jpg' || file.mimetype=='image/jpeg' || file.mimetype=='image/png' || 
          file.mimetype=='image/svg' ||
          file.mimetype=='image/gif'){
              cb(null, true);

          }else{
           cb(null,false);
           return cb(new Error('onlyjpg, joeg,png, svg, gif file allowed'));
          }
      },
      limits:max_size
  })
route.get('/add-banner',bannerController.userAuth, bannerController.addBanner)
route.post('/create-banner',upload.single('image'), bannerController.createBanner)
route.get('/list-banner', bannerController.userAuth,bannerController.listBanner)

route.get('/delete/:id',bannerController.userAuth, bannerController.deleteBanner)

route.get('/status-change/:id',bannerController.userAuth, bannerController.statusBanner)
route.get('/edit-banner/:id',bannerController.userAuth, bannerController.editBannner)
route.post('/update-banner', bannerController.updatedBannner)





module.exports= route