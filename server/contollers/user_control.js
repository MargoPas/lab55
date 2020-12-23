const {
    user,
    Sequelize
} = require("../models/campaigns");
const db_module = require('../db')
let self = {};
const camp = require('../CampaignDB')

self.getAll = async (req,res) => {
    try{
        let data = await camp.Campaign.findAll({
            attributes:["CampaignName","CampaignQuest", "CampaignSituation", "User_id" , 'Number', "UserList"]
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
        let CampaignName= req.body.CampaignName;
        let data = await camp.Campaign.destroy({
            where:{
                CampaignName: CampaignName
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

self.newNumber = async (req,res) => {
    try {
        let string = ''
        let there = true;
        let body = await req.body;
        console.log(body)
        let data = await camp.Campaign.findOne({
            attributes:["CampaignName","CampaignQuest", "CampaignSituation", "User_id", 'Number', "UserList"],
            where:{
                CampaignName: body.CampaignName // создатель
            }
        });
        var a = data.dataValues.UserList.split(' ')
        console.log('\n\n\n', a, '\n\n\n')
        for (let i = 0; i < a.length; i++){
            if (a[i] == body.id){ // текущий ользователь
                there = false
            }
        }
        console.log(there)

        if (there) {
            console.log("мф как минимум зашли в иф")

            console.log('\n\n\n', a, '\n\n\n')
            let errorid = String(body.id)
            console.log(errorid)
            //a.append(String(body.id))
            string = a.join(' ')
            string = string + ' ' + errorid
            console.log(string)

            let newNum = data.dataValues.Number + 1
           const last_body = {
                Number: newNum,
                UserList: string
            }
            console.log(last_body)
            let last_data = await camp.Campaign.update(last_body, {
                where: {
                    CampaignName:body.CampaignName
                }
            });
            console.log(last_data)
            return res.json({
                status: "ok",
                data: last_data
            })
        }
        else{
            return res.json({
                status:'no',
                data: 'updating failed'
            })

        }


    } catch
        (error) {
        res.status(500).json({
            status: "error",
            data: error
        })
    }
}

self.getNumber = async (req,res) => {
    try{
        let body = req.body;
        let data = await camp.Campaign.findOne({
            attributes:["CampaignName","CampaignQuest", "CampaignSituation", "User_id", 'Number', "UserList"],
            where:{
                CampaignName: body.CampaignName
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

self.findUsersAllCampaigns = async (req,res) => {
    try{
        let data = await camp.Campaign.findAll({where:{
            User_id: String(req.user.id)
        }});
        return res.json({
            status:"ok",
            data:data
        })
    }
    catch(error){
        res.status(500).json({
            status:"error",
            data:error
        })
    }
}

const bCrypt = require('bcrypt-nodejs');
let createHash = function(user_password){
    return bCrypt.hashSync(user_password, bCrypt.genSaltSync(10), null);
}


