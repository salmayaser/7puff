
const categoryModel = require('../models/category');
const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
let path = require("../utilities/path");
const { Cookie } = require('express-session');

module.exports = {
    showLoginPage: (req, res, next) => {
        categoryModel.find().then((categories) => {
            res.render("login.ejs", {
                categories: categories,
                isAuthenticated: false,
                errorMessage: req.flash('error')
            })
        }).catch((err) => console.log(err))


    },
    showChangePassPage: (req, res, next) => {
        categoryModel.find().then((categories) => {
            res.render("changePassword.ejs", {
                categories: categories,
                isAuthenticated: false,
                errorMessage: req.flash('error')
            })
        }).catch((err) => console.log(err))


    },
    showRegisterPage: (req, res, next) => {
        categoryModel.find().then((categories) => {
            res.render("register.ejs", {
                categories: categories,
                isAuthenticated: false,
                errorMessage: req.flash('error')
            })
        }).catch((err) => console.log(err))


    },
    login: (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;
        userModel.findOne({ email: email }).then((user) => {
            if (!user) {
                req.flash('error', 'Invalid Email or Password')

                return res.redirect("/login")
            }
            bcrypt.compare(password, user.password).then((match) => {
                if (match) {
                    req.session.isLogedIn = true;
                    req.session.user = user;
                    console.log(req.session.url)
                    return res.redirect(req.session.url || "/")
                }
                req.flash('error', 'Invalid Email or Password')
                return res.redirect("/login")

            }).catch((err) => {
                console.log(err)
                req.flash('error', 'Invalid Email or Password')
                res.redirect("/login")
            })


        })

    },
    logout: (req, res, next) => {
        req.session.destroy(() => {
            res.redirect("/")
        })
    },
    register: (req, res, next) => {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password
        userModel.findOne({ email: email }).then((userDoc) => {
            if (userDoc) {
                req.flash('error', 'This Email already Exist')
                return res.redirect("/register")
            }
            bcrypt.hash(password, 12).then((hashedPassword) => {
                const user = new userModel({
                    email: email,
                    password: hashedPassword,
                    name: firstName + " " + lastName,
                    cart: { items: [] }
                })
                user.save().then(() => {
                    res.redirect("/login")
                }).catch((err) => console.log(err))
            }).catch((err) => console.log(err))


        });
    },
    changePassword: (req, res, next) => {
        const oldPassword = req.body.oldPassword;
        const password = req.body.password;
        userModel.findOne({ _id: req.user._id }).then((user) => {
            if (!user) {
                return res.redirect("/login")
            }
            console.log(user)
            bcrypt.compare(oldPassword, user.password).then((match) => {
                if (match) {
                    bcrypt.hash(password, 12).then((hashedPassword) => {
                        userModel.findById(req.user._id).then((user) => {
                            console.log(req.user)
                            user.password = hashedPassword
                            user.save().then(() => {
                                res.redirect("/account")
                            }).catch((err) => console.log(err))

                        })
                    })

                }
                else {
                    req.flash('error', 'Old password is not correct ')
                    return res.redirect("/changePassword")
                }

            }).catch((err) => {
                console.log(err)
                req.flash('error', 'Old Password is not correct')
                res.redirect("/changePassword")
            })


        })

    }
}