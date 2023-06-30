const express =require('express');
const route = express.Router();
const faqController= require('../../controller/admin/faq.controller')



route.get('/',faqController.userAuth,faqController.listFaq)
route.get('/add-faq',faqController.userAuth,faqController.addFaq)
route.post('/insert-faq',faqController.inserFaq)
route.get('/status-change/:id', faqController.userAuth,faqController.statusChange);
route.get('/edit-faq/:id', faqController.userAuth, faqController.editFqa);
route.post('/update-faq', faqController.updateFqa);
route.get('/delete-faq/:id', faqController.userAuth, faqController.deleteFqa);
route.get('/view-faq/:id', faqController.userAuth, faqController.viewFaq);






module.exports = route;
