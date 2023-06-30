const express =require('express');
const route = express.Router();
const categoryController= require('../../controller/admin/category.controller')



 route.get('/list-category',categoryController.userAuth,categoryController.listCategory)
route.get('/add-category',categoryController.userAuth,categoryController.addCategory)
route.post('/create-category',categoryController.createCategory)
route.get('/status-change/:id', categoryController.userAuth,categoryController.statusCategory);
 route.get('/delete/:id', categoryController.userAuth,categoryController.deleteCategory);







module.exports = route;
