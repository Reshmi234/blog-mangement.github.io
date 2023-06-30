const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const bodyParser= require('body-parser');
_=require('underscore')
const flash= require('connect-flash')
const session= require('express-session')
const cookieParser = require('cookie-parser')
const os = require('os')


app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');
 app.set('views', [__dirname + '/views/admin', __dirname + '/views/front'])


app.use(session({
    secret:'RPAWEE12SH3',
    cookie:{maxAge:40000},                          
    resave:false,
    saveUninitialized:true

}))
app.use(flash());
app.locals.moment= require('moment')
app.use(cookieParser())
app.use(bodyParser.urlencoded({
    extended:true 
}))
 const jwtaut = require('./middleware/auth_jwt_middleware')
app.use([jwtaut.authfrontJWT,jwtaut.authJWT])
// const jwtfrontaut = require('./middleware/auth_jwt_middleware')
// app.use(jwtfrontaut.authfrontJWT)
/**
 * Admin Rputes----------------------------------
 */
const adminRouter =require('./route/admin/admin.route')
app.use('/admin',adminRouter)
const faqRouter = require('./route/admin/faq.route');
app.use('/faq-mangement', faqRouter);
const bannerRouter = require('./route/admin/banner.route');
app.use('/banner', bannerRouter);
const categoryRouter = require('./route/admin/categrory.route');
app.use('/category', categoryRouter);

const contactRouter = require('./route/admin/contact.route');
app.use('/contact', contactRouter);
const userdetailstRouter = require('./route/admin/user-details.route');
app.use('/user-details', userdetailstRouter);
const blogtRouter = require('./route/admin/blog.route');
app.use('/blog-details', blogtRouter);
/**
 * Fornt Rputes----------------------------------
 */
const frontRouter= require('./route/front/front.route')
app.use(frontRouter)

const userRouter= require('./route/front/user.route')
app.use('/user',userRouter)
const writeBlogRouter= require('./route/front/writeblog.route')
app.use('/blog', writeBlogRouter)


const port= process.env.PORT
require(path.join(__dirname, '/config','database'))();
app.listen(port,()=>{
    console.log(`Server is connected @ http://127.0.0.1:${port}`);
    
})