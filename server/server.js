
const passport = require('passport')
const session = require('express-session')
const bCrypt = require('bcrypt-nodejs');  //for signup
const express = require('express');
const hbs = require('hbs')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const localStrategy = require('passport-local').Strategy
const db_module = require('./db')
const cors = require('cors')
const app = express();
//логирование
app.use(cors())
app.use(function (req, res, next) {
    let now = new Date()
    let hour = now.getHours()
    let minutes = now.getMinutes()
    let seconds = now.getSeconds()
    let data = `${hour}:${minutes}:${seconds} ${req.method} ${req.url} ${req.get('user-agent')}`
    console.log(data)
    next()
})
const flash = require('connect-flash');


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'you secret key',
    secure: false,
    resave: true,}))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


passport.use('login', new localStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
        db_module.User.findOne({where :{ user_login :  username }})
            .then(function(user){
                if(!user){
                    console.log('Пользователь не найден с именем '+username);
                    return done(null, false, req.flash('message', 'Пользователь не найден'));
                }
                if (!isValidPassword2(user, password)){
                    console.log('Неверный пароль');
                    return done(null, false, req.flash('message', 'неверный пароль'));
                }
                return done(null, user);
            }) .catch(err=>console.log(err))
    })
);


passport.use( 'signup',
    new localStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done){
                console.log('!');
            findOrCreateUser = function(){
                db_module.User.findOne({where:{ user_login :  username }})
                    .then (function(user) {
                    if (user) {
                        console.log('Данное имя пользователя уже используется: '+username);
                        return done(null, false, req.flash('message','Пользователь с таким именем существует'));
                    }
                    else {
                        let newUser = new db_module.User({first: req.body.first, last : req.body.last, user_login : username, user_password: createHash(password), role: 'user'});
                        newUser.save()
                            .then(()=>{
                                console.log('Успешная регистрация');
                                return done(null, newUser);
                            })
                    }
                }).catch(err=>console.log(err));
            };
            process.nextTick(findOrCreateUser);
        })
);

db_module.connect

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());

const todoRoutes = require('./router')
app.use(todoRoutes)

db_module.synchronize
    app.listen(3001, function(){
        console.log("Сервер ожидает подключения...");
    });

passport.serializeUser(function (user, done) {
    console.log('serializing user')
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    db_module.User.findOne({where: {id: id}})
        .then(user => {
            console.log('deserilizing user'); console.log(user);
            done(null, user)})
});

let createHash = function(user_password){
    return bCrypt.hashSync(user_password, bCrypt.genSaltSync(10), null);
}

let isValidPassword2 = function(user, password){
    return bCrypt.compareSync(password, user.user_password);
}

module.exports.passport = passport