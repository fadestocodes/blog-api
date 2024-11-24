const {Router} = require('express');
const indexRouter = Router();

indexRouter.get('/', (req,res)=>{
    
    const user = res.locals.user;
    res.render('home', {user});
});

module.exports = {indexRouter};