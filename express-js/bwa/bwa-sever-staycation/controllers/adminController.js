const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const Users = require('../models/Users');
const fs = require('fs');
// const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcrypt');

module.exports = {
    viewSignin: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };
            res.render('index', {
                alert,
                title: "Staycation | Login"
            });
        } catch (error) {
            res.redirect('/admin/signin');
        }
    },
    actionSignin: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await Users.findOne({username: username});

            if(!user){
                req.flash('alertMessage', 'User yang Anda masukkan tidak ada!!');
                req.flash('alertStatus', 'danger');
                res.redirect('/admin/signin');
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if(!isPasswordMatch){
                req.flash('alertMessage', 'Password yang Anda masukkan tidak cocok!!!');
                req.flash('alertStatus', 'danger');
                res.redirect('/admin/signin');
            }

            res.redirect('/admin/dashboard');
        } catch (error) {
            res.redirect('/admin/signin');
        }
    },

    viewDashboard: (req, res) => {
        res.render('admin/dashboard/view_dashboard', {
            title: "Staycation | Dashboard"
        });
    },

    viewCategory: async (req, res) => {
        try {
            const category = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };
            res.render('admin/category/view_category', {
                category,
                alert,
                title: "Staycation | Category"
            });
        } catch (error) {
            res.redirect('/admin/category');
        }
    },
    addCategory: async (req, res) => {
        try {
            const { name } = req.body;
       
            await Category.create({ name });
            req.flash('alertMessage', 'Success Add Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }        
    },
    editCategory: async (req, res) => {
        try {
            const { id, name } = req.body;
            const category = await Category.findOne({_id: id});
            
            category.name = name;
            await category.save();
            
            req.flash('alertMessage', 'Success Update Category');
            req.flash('alertStatus', 'success');

            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }        
    },
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findOne({_id: id});
            await category.remove();

            req.flash('alertMessage', 'Success Delete Category');
            req.flash('alertStatus', 'success');
            
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },
    

    viewBank: async (req, res) => {
        try {
            const bank = await Bank.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };
            
            res.render('admin/bank/view_bank', {
                title: "Staycation | Dashboard",
                alert,
                bank
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
    addBank: async (req, res) => {
        try {
            const {name, nameBank, nomorRekening} = req.body;
            await Bank.create({
                name,
                nameBank,
                nomorRekening,
                imageUrl : `images/${req.file.filename}`
            });
            
            req.flash('alertMessage', 'Success Add Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            console.log(error);
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
    editBank: async (req, res) => {
        try {
            const {id, name, nameBank, nomorRekening} = req.body;
            
            const bank = await Bank.findOne({ _id: id});
            console.log(req.file);
            if (req.file == undefined) {
                bank.name = name;
                bank.nameBank = nameBank;
                bank.nomorRekening = nomorRekening;
                await bank.save();
                req.flash('alertMessage', 'Success Update Bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank');
            } else {
                await fs.unlink(path.join(`public/${bank.imageUrl}`), (err) => {
                        if (err) throw err; 
                    }
                );
                bank.name = name;
                bank.nameBank = nameBank;
                bank.nomorRekening = nomorRekening;
                bank.imageUrl = `images/${req.file.filename}`;
                await bank.save();
                req.flash('alertMessage', 'Success Update Bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank'); 
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
    deleteBank: async (req, res) => {
        try {
            const { id } = req.params;
            const bank = await Bank.findOne({ _id: id});
            await fs.unlink(path.join(`public/${bank.imageUrl}`), (err) => {
                    if (err) throw err; 
                }
            );
            await bank.remove(); 

            req.flash('alertMessage', 'Success Delete Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank'); 
        } catch (error) {
            console.log(error);
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },

    viewItem: async (req, res) => {    
        try {
            const item = await Item.find()
                .populate({path:'imageId', select: 'id imageUrl'})
                .populate({path: 'categoryId', select: 'id name'});
                
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };

            const category = await Category.find();

            res.render('admin/item/view_item', {
                title: "Staycation | Item",
                alert,
                category,
                item,
                action: 'view'
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    showImageItem: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Item.findOne({_id: id})
                .populate({path:'imageId', select: 'id imageUrl'});
            console.log(item.imageId);
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };

 

            res.render('admin/item/view_item', {
                title: "Staycation | Show Image Item",
                alert,
                item,
                action: 'show image'
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    addItem: async (req, res) => {
        try {
            const {categoryId, title, price, city, about} = req.body;
            if(req.files.length > 0){
                const category = await Category.findOne({_id: categoryId});
                const newItem = {
                    categoryId: category._id,
                    title,
                    description: about,
                    price, 
                    city 
                }
                const item = await Item.create(newItem);
                category.itemId.push({_id: item._id});
                await category.save();
                for(let i = 0; i < req.files.length; i++){
                    const imageSave = await Image.create({imageUrl : `images/${req.files[i].filename}`});
                    item.imageId.push({_id: imageSave._id});
                    await item.save();
                }
                req.flash('alertMessage', 'Success Add Item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/item');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    editItem: async (req, res) => {
        try {
            
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },

    viewBooking: (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus };
            res.render('admin/booking/view_booking', {
                title: "Staycation | Dashboard",
                alert
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/booking');
        }
    }
}