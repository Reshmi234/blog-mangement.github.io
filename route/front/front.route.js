const  express= require('express')
const route= express.Router() 
const frontController= require('../../controller/front/front.controller')





route.get('/',frontController.indexPage)
route.get('/about',frontController.aboutPage)
route.get('/contact',frontController.contactPage)
//route.get('/contact',frontController.contactPage)
route.post('/create-contact',frontController.createContact)
route.get('/category/:id',frontController.categoryPage)
route.get('/single-page/:id',frontController.detailsPage)
route.get('/single-post',frontController.singlePage)

route.get('/search-result',frontController.searchPage)
// route.get('/category-blog/:id',frontController.categoryBlog)

module.exports= route;