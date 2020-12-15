const {
    user,
    Sequelize
} = require("../models/campaigns");
const db_module = require('../db')
let self = {};
const camp = require('../CampaignDB')
self.getAll = async (req,res) => {
    try{
        let data = await db_module.User.findAll({
            attributes:["id","first", "last", "user_login","user_password", "role"]
        });
        return res.json({
            status:"ok",
            data:data
        })
    }catch(error){
        res.status(500).json({
            status:"error",
            data:error
        })
    }
}


self.get = async (req,res) => {
    try{
        let user_login = req.params.user_login;
        let data = await db_module.User.findOne({
            attributes:["id","first", "last", "user_login","user_password", "role"],
            where:{
                user_login:user_login
            }
        });
        return res.json({
            status:"ok",
            data:data
        })
    }catch(error){
        res.status(500).json({
            status:"error",
            data:error
        })
    }
}

self.getUserID = async(req, res)=>{
    try{
        let data = await req.user.id
        return res.json({
            status:'ok',
            data: data
        })
    }
    catch (error){
        res.status(500).json({
            status:"error",
            data:error
        })
    }
}

self.save = async (req,res) => {
    try {
        if (req.user.user_login !== undefined) {
            let data = await req.user;
            return res.json({
                status: "ok",
                data: data,
                flash: req.flash('message')
            })
        }
        else return res.json({
            status:'strategy is not good',
            flash: req.flash('message')
        })
    }catch(error){
        console.log(error)
        console.log(req.flash('message'))
        res.status(500).json({

            status: req.flash('message'),
            data:error,
            flash:''
        })
    }
}

self.getMessage = async(req, res)=>{
    try{
        let data = await req.flash('message')
        return res.json({
            status:'ok',
            data: data
        })
    }
    catch (error){
        res.status(500).json({
            status:"error",
            data:error
        })
    }
}

self.update = async (req,res) => {
    try{
        let user_login = req.body.user_login;
        db_module.User.findOne({where:{ user_login :  user_login }})
            .then(function(user){
                if (user){
                    return res.json({
                        status:'User is already in database'
                    })

                }
                else {
                    user_login = req.params.user_login
                    let body = req.body
                    body.user_password = createHash(body.user_password)
                    let data = db_module.User.update(body, {
                        where: {
                            user_login: user_login
                        }
                    });
                    return res.json({
                        status:"ok",
                        data:data
                    })

                }
            })




    }catch(error){
        res.status(500).json({
            status:"error",
            data:error
        })
    }
}

self.delete = async (req,res) => {
    try{
        let user_login = req.params.user_login;
        let data = await db_module.User.destroy({
            where:{
                user_login:user_login
            }
        });
        return res.json({
            status:"ok",
            data:data
        })
    }catch(error){
        res.status(500).json({
            status:"error",
            data:error
        })
    }
}

module.exports = self;


self.saveCampaign = async (req,res) => {
    try {
            let data = await req.body;
            let newCampaign = new camp.Campaign(data);
            newCampaign.save()
            .then(()=>{
                console.log('Успешное сохранение кампании');
            })
            return res.json({
                status: "ok",
                data: data
            })
    } catch
        (error) {
        res.status(500).json({
            status: "error",
            data: error
        })
    }
}
const bCrypt = require('bcrypt-nodejs');
let createHash = function(user_password){
    return bCrypt.hashSync(user_password, bCrypt.genSaltSync(10), null);
}


