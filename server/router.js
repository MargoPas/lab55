const user_ctrl = require("./contollers/user_control");
const {Router} = require('express');
const passport = require('passport')
const router = Router()
const cors = require('cors')
let isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/home_auth'); //надо добавить туда зарегистрироваться и войти кнопки
}

let isAdmin = function (req, res, next) {
    if (req.user) {
        if (req.user.role == 'admin') {
            return next();
        }
        return res.json({
            status: "not admin"
        })
    }
    else{
        return res.json({
            status:'not user'
        })
    }
}
let isUser = function (req, res) {
    if (req.user) {
        if ((req.user.role == 'user') | (req.user.role == 'admin' ) ) {
            return res.json({
                status: "user"
            })
        }

    } else {
        return res.json({
            status: 'not user'
        })
    }
}

router.get('/api/logout', isAuthenticated, (req, res) => {
    req.logout();
    res.json({
        'status':'logout'
    })
});
router.get('/error', (req, res) =>{
    res.json({
        "status":"error",
        "message":req.flash.message
    })
})
router.get('/data', isAdmin, user_ctrl.getAll)
router.get('/home_str/:user_login', isUser, user_ctrl.get)

router.post("/api/signup",  passport.authenticate('signup', {
    failureRedirect: '/api/error',
    failureFlash : true}), user_ctrl.save);

router.post('/api/login', passport.authenticate('login', {
    failureRedirect: '/api/error',
    failureFlash : true}), user_ctrl.save)


router.put("/update/:user_login", isUser, user_ctrl.update);

router.delete("/delete/:user_login", isAdmin, user_ctrl.delete);

const bCrypt = require('bcrypt-nodejs');
let createHash = function(user_password){
    return bCrypt.hashSync(user_password, bCrypt.genSaltSync(10), null);
}

router.post("/api/newCampaign", user_ctrl.saveCampaign);
router.get("/api/newCampaign", isUser)
router.get("/api/user_id", user_ctrl.getUserID);
router.get('/api/error', user_ctrl.getMessage);


module.exports = router