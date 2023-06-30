const express =require('express');
const route = express.Router();
const contactController= require('../../controller/admin/contact.controller')

route.get('/list-contact',contactController.listContact)
route.get('/delete/:id',contactController.deleteContact)

module.exports= route