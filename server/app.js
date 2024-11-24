const express = require('express');
const app = express();
const {PrismaSessionStore} = require('@quixo3/prisma-session-store');
// const {PrismaClient} = require('@prisma/client');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const cors = require('cors');
require('dotenv').config();
const prisma = require('./prisma/prisma');
const { indexRouter } = require('./routes/indexRoutes');
const { signupRouter } = require('./routes/signupRoutes');
const { loginRouter } = require('./routes/loginRoutes');
const { logoutRouter } = require('./routes/logoutRoutes');
const { protectedRouter } = require('./routes/protectedRoute');

const {createServer : createViteServer} = require('vite');
const {renderToString} = require('react-dom/server');
const React = require('react');
const {StaticRouter} = require('react-router-dom/server');
const App = require('../client/src/App').default;
const isProd = process.env.NODE_ENV === 'production';

async function startServer (){
    if (!isProd){
        const vite = await createViteServer({
            server : {middlewareMode : 'ssr'}
        });
        app.use(vite.middlewares);
    } else {
        app.use(express.static(path.resolve(__dirname, '../dist/client')));
    }
    app.use(express.json());
    app.use(session({
        cookie : {
            maxAge : 7*24*60*1000 
        },
        secret : 'biggiethegreat',
        resave : false,
        saveUninitialized : false,
        store : new PrismaSessionStore(
            prisma, {
                checkPeriod : 2 * 60 * 1000,
                dbRecordIdIsSessionId : false,
            }
        )
    }));
    
    
    passport.use(
        new LocalStrategy ( async (username, password, done)=>{
            try {
                const user = await prisma.user.findUnique({
                    where : { username }
                });
                console.log("User: ", user);
                if (!user){
                    console.log("User not found");
                    return done(null, false, {message:"Incorrect username"});
                }
                const match = await bcrypt.compare(password, user.password);
                if (!match){
                    console.log("Incorrect password!");
                    return done(null, false, {message:"Incorrect password"});
                }
                return done(null, user);
            } catch (error){
                console.error("Unexpected error authenticating", error);
                return done(error)
            }
        })
    );
    
    const jwtOptions = {
        jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey : process.env.JWT_KEY
    };
    passport.use(
        new jwtStrategy(jwtOptions, async (jwtPayload, done)=>{
            console.log("JWT Options Secret Key: ", jwtOptions.secretOrKey);
            try {
                console.log('jwtPayload: ', jwtPayload);
                console.log('jwtOptions: ', jwtOptions);
                const user = await prisma.user.findUnique({
                    where : {id : jwtPayload.id}
                });
            if (!user){
                return done (null, false);
            }
            return done(null, user);
        } catch (err) {
            console.error("Error authenticating JWT Token: ", err);
            return done(err, false);
        }
    }));
    
    
    passport.serializeUser((user,done)=>{
        // console.log("USer serialized", user);
        done(null,user)
    });
    
    passport.deserializeUser(async (user,done)=>{
        try {
            const userMatch = await prisma.user.findUnique({
                where : { id : user.id }
            });
            if (!userMatch){
                console.log("Error deserializing user");
                return done(null, false);
            }
            done (null,user);
        } catch (error) {
            done (error);
        }
    });
    
    app.use(passport.initialize());
    app.use(passport.session());
    app.use((req,res,next)=>{
        res.locals.user = req.user;
        next();
    });
    
    
    app.use(cors({
        origin : 'http://localhost:3000',
        methods : ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders : ['Authorization', 'Content-Type']
    }));
    
    // app.use('/', indexRouter);
    // app.use('/sign-up', signupRouter);
    // app.use('/login', loginRouter);
    // app.use('/logout', logoutRouter);
    // app.use('/admin', protectedRouter);
    
    app.use('/api', require('./routes/apiRoute'));
    app.get('*', async (req,res)=>{
        const context = {};
        const url = req.originalUrl;
        let template, render;
        if (!isProd){
            const vite = await createViteServer();
            template = await vite.transformIndexHtml(url, '<!DOCTYPE html><div id="root"></div>');
            render = (await vite.ssrlLoadModule(path.resolve(__dirname, '../client/src/entry-server.jsx'))).default;
        } else {
            template = require('fs').readFileSync(
                path.resolve(__dirname, '../client/index.html'),
                'utf-8'
            );
            render = require('../dist/server/entry-server.js').default;
        }
        const appHtml = renderToString(
            < StaticRouter location = {url} context = {context} >
                <App />
            </StaticRouter>
        );
        const html = template.replace('<!--ssr-outlet-->', appHtml);
        res.status(200).set({'Content-Type' : 'text/html'}).end(html);
    });

    
    
    app.listen(3000, ()=>console.log("Express App Listening On Port: 3000"));


}    
startServer();





