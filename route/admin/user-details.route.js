const express =require('express');
const route = express.Router();
const userdetailsController= require('../../controller/admin/user-details.controller')



 route.get('/list-user',userdetailsController.listuser)
 route.get('/status-change/:id',userdetailsController.statusUser)
 route.get('/delete/:id',userdetailsController.deleteUser)







module.exports = route;