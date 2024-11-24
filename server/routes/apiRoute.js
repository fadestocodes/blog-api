const {Router} = require('express');
const apiRouter = Router();

apiRouter.get('/', (req,res)=>{
    res.json({message : 'API Data Works!'});
});



module.export = {apiRouter};