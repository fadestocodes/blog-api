const express = require('express');
const app = express();
const {PrismaSessionStore} = require('@quixo3/prisma-session-store');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const bcrypt = require('bcryptjs');

app.use(express.urlencoded({extended : true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(session({
    cookie : {
        maxAge : 7*24*60*1000 
    },
    secret : 'biggiethegreat',
    resave : true,
    saveUninitialized : true,
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

passport.serializeUser((user,done)=>{
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








app.listen(3000, ()=>console.log("Express App Listening On Port: 3000"));

