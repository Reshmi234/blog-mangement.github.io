const express =require('express');
const route = express.Router();
const blogController= require('../../controller/admin/blog.controller')


route.get('/list-blog', blogController.listBlog);
route.get('/status-change/:id',blogController.statusChange);
route.get('/delete/:id',blogController.deleteBlog);







module.exports = route