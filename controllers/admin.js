

const productModel = require('../models/products');
const categoryModel = require('../models/category');
const sliderModel = require('../models/slider');
const orderModel = require('../models/order');
const countryModel = require('../models/country');

getAllCatgories = function () {
    return categoryModel.find().then((categories) => categories)
}
module.exports = {
    //show add prodcts page
    showAddProduct: (req, res, next) => {
        if (req.session.admin) {
            console.log(req.admin)
            getAllCatgories().then((categories) => {
                res.render('dashboard-addProduct.ejs', {
                    categories: categories
                })
            })
        } else {
            res.redirect("/admin/login")
        }

    },
    //add a product
    addProduct: (req, res, next) => {
        if (req.session.admin) {
            let title = req.body.title;
            let price = req.body.price;
            let description = req.body.description;
            let quantity = req.body.quantity;
            let category = req.body.category;
            let image = req.file;
            let code = req.body.code;
            if (!image) {
                console.log("enter an image")
            }
            const imageUrl = image.path
            const product = new productModel({
                title: title,
                price: price,
                description: description,
                quantity: quantity,
                category: category,
                image: imageUrl,
                code: code
            })
            product.save().then((result) => {
                console.log(result);
                res.redirect("/admin")
            }).catch((err) => console.log(err))
        } else {
            res.redirect("/admin/login")
        }
    },
    //fetchingAllProducts
    fetchAllProducts: (req, res, next) => {
        if (req.session.admin) {
            productModel.find().then((products) => {
                res.render('dashboard-allProducts.ejs', {
                    products: products,

                })
            }).catch((err) => console.log(err))
        } else {
            res.redirect("/admin/login")
        }
    },

    //show Edit product page
    showEditProduct: (req, res, next) => {
        if (req.session.admin) {
            id = req.params.id
            getAllCatgories().then((categories) => {
                productModel.findById(id).then((product) => {
                    res.render("dashboard-edit", {
                        product: product,
                        categories: categories,
                    })
                }).catch((err) => console.log(err))
            })
        }
        else {
            res.redirect("/admin/login")
        }
    },
    editProduct: (req, res, next) => {
        if (req.session.admin) {
            id = req.params.id
            let title = req.body.title;
            let price = req.body.price;
            let description = req.body.description;
            let quantity = req.body.quantity;
            let category = req.body.category;
            productModel.findById(id).then((product) => {
                product.title = title;
                product.price = price;
                product.description = description;
                product.quantity = quantity;
                product.category = category;
                product.save().then(() => {
                    res.redirect("/admin")
                }).catch((err) => console.log(err))
            })
        } else {
            res.redirect('/admin/login')
        }
    },
    deleteProduct: (req, res, next) => {
        if (req.session.admin) {
            id = req.params.id
            productModel.findByIdAndRemove(id).then(() => {
                res.redirect('/admin')
            }).catch((err) => console.log(err))
        } else {
            res.redirect('/admin/login')
        }
    },

    //show add category page 
    showAddCategory: function (req, res, next) {
        if (req.session.admin) {
            let cat = getAllCatgories().then((categories) => {
                res.render('dashboard-addCategory.ejs', {
                    categories: categories
                })
            })
        } else {
            res.redirect('/admin/login')
        }
    },
    //adding a category
    addCategory: (req, res, next) => {
        if (req.session.admin) {
            let title = req.body.title;
            const category = new categoryModel({ title: title })
            category.save().then((result) => {
                console.log(result);
                res.redirect("/admin/addCategory")
            }).catch((err) => console.log(err))
        } else {
            res.redirect("/admin/login")
        }
    },
    //delete category
    deleteCategory: (req, res, next) => {
        id = req.params.id
        categoryModel.findByIdAndRemove(id).then(() => {
            res.redirect('/admin/addCategory')
        }).catch((err) => console.log(err))
    },
    //show add country page 
    showAddCountry: function (req, res, next) {
        if (req.session.admin) {
            countryModel.find().then((countries) => {
                res.render('dashboard-addcountry.ejs', {
                    countries: countries || []
                })
            })

        } else {
            res.redirect('/admin/login')
        }
    },
    //adding a country
    addCountry: (req, res, next) => {
        if (req.session.admin) {
            let title = req.body.title;
            const country = new countryModel({ title: title })
            country.save().then((result) => {
                console.log(result);
                res.redirect("/admin/addcountry")
            }).catch((err) => console.log(err))
        } else {
            res.redirect("/admin/login")
        }
    },
    //delete ccountry
    deleteCountry: (req, res, next) => {
        id = req.params.id
        countryModel.findByIdAndRemove(id).then(() => {
            res.redirect('/admin/addcountry')
        }).catch((err) => console.log(err))
    },
    showAddSlider: (req, res, next) => {
        sliderModel.find().then((sliders) => {
            res.render("dashboard-addSlider.ejs", {
                sliders: sliders
            })
        }).catch((err) => console.log(err))
    },
    addSlider: (req, res, next) => {
        let title = req.body.title;
        let description = req.body.description;
        let image = req.file
        const imageUrl = image.path
        const slider = new sliderModel({ title: title, description: description, image: imageUrl })
        slider.save().then((result) => {
            console.log(result);
            res.redirect("/admin/addSlider")
        }).catch((err) => console.log(err))

    },
    deleteSlider: (req, res, next) => {
        id = req.params.id
        sliderModel.findByIdAndRemove(id).then(() => {
            res.redirect('/admin/addSlider')
        }).catch((err) => console.log(err))
    },
    viewOrders: (req, res, next) => {
        orderModel.find().then((orders) => {
            res.render("dashboard-orders.ejs", {
                orders: orders
            })
            console.log(orders)
        })
    },
    showLoginPage: (req, res, next) => {
        res.render("dashboard-login.ejs", {
            errorMessage: req.flash('error')
        })


    },
    login: (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;
        if (email == "admin@7puff.com" && password == "7PuffDashboard") {
            req.session.admin = true;
            res.redirect("/admin")
        } else {
            req.flash('error', 'Invalid Email or Password')
            res.redirect("/admin/login")
        }
    },
    logout: (req, res, next) => {
        req.session.destroy(() => {
            res.redirect("/admin/login")
        })
    },

}

