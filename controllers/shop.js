const productModel = require('../models/products')
const categoryModel = require('../models/category');
const orderModel = require('../models/order');
const sliderModel = require('../models/slider');
const countryModel = require('../models/country');
const userModel = require('../models/user');
const loginId = require('../utilities/paymentCred').loginId;
const transactionKey = require('../utilities/paymentCred').transactionKey;
const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;
const SDKConstants = require('authorizenet').Constants;



module.exports = {

    //show Home page
    fetchAllProducts: (req, res, next) => {
        productModel.find().then((products) => {
            categoryModel.find().then((categories) => {
                sliderModel.find().then((sliders) => {

                    productModel.aggregate([{
                        "$group": {
                            "_id": null,
                            "MaximumValue": { "$max": "$price" },
                            "MinimumValue": { "$min": "$price" }
                        }
                    }]).then((maxAndMin) => {
                        let Cartproducts = [];
                        let cartSize = 0;
                        if (req.user) {
                            req.user.populate("cart.items.productId").execPopulate().then((user) => {
                                Cartproducts = user.cart.items;
                                cartSize = Cartproducts.length
                                console.log(req.session.isLogedIn)
                                res.render('home.ejs', {
                                    products: products,
                                    categories: categories,
                                    cartProducts: Cartproducts,
                                    maxPrice: maxAndMin[0].MaximumValue,
                                    minPrice: maxAndMin[0].MinimumValue,
                                    priceValue: maxAndMin[0].MinimumValue + 120,
                                    isAuthenticated: req.session.isLogedIn,
                                    cartSize: cartSize,
                                    sliders: sliders
                                })
                            })
                        } else {
                            res.render('home.ejs', {
                                products: products,
                                categories: categories,
                                cartProducts: Cartproducts,
                                maxPrice: maxAndMin[0].MaximumValue,
                                minPrice: maxAndMin[0].MinimumValue,
                                priceValue: maxAndMin[0].MinimumValue + 120,
                                isAuthenticated: req.session.isLogedIn,
                                cartSize: cartSize,
                                sliders: sliders
                            })

                        }
                    })
                }).catch((err) => console.log(err))

            })

        }).catch((err) => console.log(err))
    },
    //FetchSingleProduct
    SingleProduct: (req, res, next) => {
        id = req.params.id
        req.session.url = req.url
        productModel.findById(id).then((product) => {
            categoryModel.find().then((categories) => {
                res.render('single-product.ejs', {
                    product: product,
                    categories: categories,
                    isAuthenticated: req.session.isLogedIn
                })
            })


        }).catch((err) => console.log(err))
    },
    //show about us page 
    showAbout: (req, res, next) => {
        categoryModel.find().then((categories) => {
            res.render('about-us.ejs', {
                categories: categories,
                isAuthenticated: req.session.isLogedIn
            })
        })

    },
    //show contact us page 
    showContact: (req, res, next) => {
        categoryModel.find().then((categories) => {
            res.render('contact-us.ejs', {
                categories: categories,
                isAuthenticated: req.session.isLogedIn
            })
        })

    },
    //add to cart
    addToCart: (req, res, next) => {
        if (!req.user) {
            return res.redirect("/login")
        }
        const id = req.params.id;
        const quantity = req.body.quantity
        productModel.findById(id).then((product) => {
            return req.user.addToCart(product, Number(quantity));
        }).then((result) => {
            console.log(result);
            res.redirect('/cart')
        })
    },
    //show cart page
    showCart: (req, res, next) => {
        if (req.user) {
            req.user.populate("cart.items.productId").execPopulate().then((user) => {
                const products = user.cart.items;
                categoryModel.find().then((categories) => {
                    res.render("cart.ejs", {
                        categories: categories,
                        products: products,
                        totalPrice: 0,
                        isAuthenticated: req.session.isLogedIn
                    })
                })

            }).catch((err) => console.log(err))
        } else {
            req.session.url = req.originalUrl
            res.redirect("/login")
        }
    },
    //delete from cart
    deleteCartItem: (req, res, next) => {
        const id = req.params.id;
        req.user.removeFromCart(id).then(() => res.redirect("/cart")).catch((err) => console.log(err))
    },
    //create an order
    createOrder: (req, res, next) => {
        req.user.populate("cart.items.productId").execPopulate().then((user) => {
            const products = user.cart.items.map(i => {
                return {
                    quantity: i.quantity,
                    product: { ...i.productId._doc }
                }
            });
            const order = new orderModel({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products: products
            })
            return order.save().then(() => {
                return req.user.clearCart().then(() => res.redirect('/orders'))

            }
            ).catch((err) => console.log(err))
        })


    },
    //filter by category 
    filterByCategory: (req, res, next) => {
        const categoryId = req.params.id
        productModel.find({ category: categoryId }).then((products) => {
            categoryModel.find().then((categories) => {
                sliderModel.find().then((sliders) => {
                    productModel.aggregate([{
                        "$group": {
                            "_id": null,
                            "MaximumValue": { "$max": "$price" },
                            "MinimumValue": { "$min": "$price" }
                        }
                    }]).then((maxAndMin) => {
                        let Cartproducts = [];
                        let cartSize = 0;
                        if (req.user) {
                            req.user.populate("cart.items.productId").execPopulate().then((user) => {
                                Cartproducts = user.cart.items;
                                cartSize = Cartproducts.length
                                console.log(req.session.isLogedIn)
                                res.render('home.ejs', {
                                    products: products,
                                    categories: categories,
                                    cartProducts: Cartproducts,
                                    maxPrice: maxAndMin[0].MaximumValue,
                                    minPrice: maxAndMin[0].MinimumValue,
                                    priceValue: maxAndMin[0].MinimumValue + 120,
                                    isAuthenticated: req.session.isLogedIn,
                                    cartSize: cartSize,
                                    sliders: sliders
                                })
                            })
                        } else {
                            res.render('home.ejs', {
                                products: products,
                                categories: categories,
                                cartProducts: Cartproducts,
                                maxPrice: maxAndMin[0].MaximumValue,
                                minPrice: maxAndMin[0].MinimumValue,
                                priceValue: maxAndMin[0].MinimumValue + 120,
                                isAuthenticated: req.session.isLogedIn,
                                cartSize: cartSize,
                                sliders: sliders
                            })

                        }

                    })
                }).catch((err) => console.log(err))

            })

        }).catch((err) => console.log(err))
    },
    filterByPrice: (req, res, next) => {
        maxPrice = req.body.price;
        productModel.find({ price: { $lte: maxPrice } }).then((products) => {
            categoryModel.find().then((categories) => {
                sliderModel.find().then((sliders) => {
                    productModel.aggregate([{
                        "$group": {
                            "_id": null,
                            "MaximumValue": { "$max": "$price" },
                            "MinimumValue": { "$min": "$price" }
                        }
                    }]).then((maxAndMin) => {
                        let Cartproducts = [];
                        let cartSize = 0;
                        if (req.user) {
                            req.user.populate("cart.items.productId").execPopulate().then((user) => {
                                Cartproducts = user.cart.items;
                                cartSize = Cartproducts.length
                                console.log(req.session.isLogedIn)
                                res.render('home.ejs', {
                                    products: products,
                                    categories: categories,
                                    cartProducts: Cartproducts,
                                    maxPrice: maxAndMin[0].MaximumValue,
                                    minPrice: maxAndMin[0].MinimumValue,
                                    priceValue: maxAndMin[0].MinimumValue + 120,
                                    isAuthenticated: req.session.isLogedIn,
                                    cartSize: cartSize,
                                    sliders: sliders
                                })
                            })
                        } else {
                            res.render('home.ejs', {
                                products: products,
                                categories: categories,
                                cartProducts: Cartproducts,
                                maxPrice: maxAndMin[0].MaximumValue,
                                minPrice: maxAndMin[0].MinimumValue,
                                priceValue: maxAndMin[0].MinimumValue + 120,
                                isAuthenticated: req.session.isLogedIn,
                                cartSize: cartSize,
                                sliders: sliders
                            })

                        }

                    }).catch((err) => console.log(err))

                })
            })
        }).catch((err) => console.log(err))

    },
    showCheckout: (req, res, next) => {
        req.user.populate("cart.items.productId").execPopulate().then((user) => {
            categoryModel.find().then((categories) => {
                countryModel.find().then((countries) => {
                    const products = user.cart.items;
                    res.render("checkout.ejs", {
                        categories: categories,
                        products: products,
                        totalPrice: 0,
                        isAuthenticated: req.session.isLogedIn,
                        countries: countries
                    })
                })
            })


        }).catch((err) => console.log(err))
    },
    showWishList: (req, res, next) => {
        res.render("wishList.ejs", {
            categories: categories,
            isAuthenticated: req.session.isLogedIn
        })
    },
    Checkout: (req, res, next) => {
        const firstName = req.body.firstName,
            lastName = req.body.lastName,
            address = req.body.address,
            email = req.body.email,
            phone = req.body.phone,
            state = req.body.state,
            city = req.body.city,
            country = req.body.country,
            total = req.body.total,
            code = req.body.code,
            cardName = req.body.cardName,
            cardNumber = req.body.cardNumber,
            expireDate = req.body.expireDate,
            cvv = req.body.cvv,
            nowDate = new Date(),
            transactionDate = nowDate.getFullYear() + '/' + (nowDate.getMonth() + 1) + '/' + nowDate.getDate();


        const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
        merchantAuthenticationType.setName(loginId);
        merchantAuthenticationType.setTransactionKey(transactionKey);

        const creditCard = new ApiContracts.CreditCardType();
        creditCard.setCardNumber(cardNumber);
        creditCard.setExpirationDate(expireDate);
        creditCard.setCardCode(cvv);

        const paymentType = new ApiContracts.PaymentType();
        paymentType.setCreditCard(creditCard);

        const orderDetails = new ApiContracts.OrderType();
        // orderDetails.setInvoiceNumber(I);
        orderDetails.setDescription('Product Description');
        const billTo = new ApiContracts.CustomerAddressType();
        billTo.setFirstName(firstName);
        billTo.setLastName(lastName);
        billTo.setAddress(address);
        billTo.setCity(city);
        billTo.setState(state);
        billTo.setCountry(country);

        const shipTo = new ApiContracts.CustomerAddressType();
        shipTo.setAddress(address);
        shipTo.setCity(city);
        shipTo.setState(state);
        shipTo.setCountry(country);

        const transactionSetting = new ApiContracts.SettingType();
        transactionSetting.setSettingName('recurringBilling');
        transactionSetting.setSettingValue('false');

        const transactionSettingList = [];
        transactionSettingList.push(transactionSetting);

        const transactionSettings = new ApiContracts.ArrayOfSetting();
        transactionSettings.setSetting(transactionSettingList);

        const transactionRequestType = new ApiContracts.TransactionRequestType();
        transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
        transactionRequestType.setPayment(paymentType);
        transactionRequestType.setAmount(total);
        transactionRequestType.setTransactionSettings(transactionSettings);
        transactionRequestType.setBillTo(billTo);
        transactionRequestType.setShipTo(shipTo);
        transactionRequestType.setOrder(orderDetails);

        const createRequest = new ApiContracts.CreateTransactionRequest();
        createRequest.setMerchantAuthentication(merchantAuthenticationType);
        createRequest.setTransactionRequest(transactionRequestType);
        const ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
        ctrl.execute(() => {
            const apiResponse = ctrl.getResponse();
            const response = new ApiContracts.CreateTransactionResponse(apiResponse);
            if (response !== null) {
                if (response.getMessages().getResultCode() === ApiContracts.MessageTypeEnum.OK) {
                    if (response.getTransactionResponse().getMessages() !== null) {

                        req.user.populate("cart.items.productId").execPopulate().then((user) => {
                            const products = user.cart.items.map(i => {
                                return {
                                    quantity: i.quantity,
                                    product: { ...i.productId._doc }
                                }
                            });
                            const order = new orderModel({
                                user: {
                                    name: req.user.name,
                                    userId: req.user,
                                    email: email,
                                    phone: phone
                                },
                                products: products,
                                date: transactionDate,

                                shipping: {
                                    address: address,

                                    city: city,
                                    state: state,
                                    country: country,
                                },

                            })
                            return order.save().then(() => {
                                return req.user.clearCart().then(() => {
                                    res.render("message.ejs",
                                        {
                                            message: "your Transaction suceeded Thank you",
                                            class: "success",
                                            isAuthenticated: req.session.isLogedIn
                                        })
                                })

                            }
                            ).catch((err) => console.log(err))
                        })

                    } else {
                        if (response.getTransactionResponse().getErrors() !== null) {
                            let code = response.getTransactionResponse().getErrors().getError()[0].getErrorCode();
                            let text = response.getTransactionResponse().getErrors().getError()[0].getErrorText();
                            res.render("message.ejs",
                                {
                                    message: `${text}`,
                                    class: "danger",
                                    isAuthenticated: req.session.isLogedIn
                                })
                            res.json({
                                error: `${code}: ${text}`
                            });
                        } else {
                            res.render("message.ejs",
                                {
                                    message: "Your Transaction failed  ",
                                    isAuthenticated: req.session.isLogedIn
                                })
                        }
                    }
                } else {
                    if (response.getTransactionResponse() !== null && response.getTransactionResponse().getErrors() !== null) {
                        let code = response.getTransactionResponse().getErrors().getError()[0].getErrorCode();
                        let text = response.getTransactionResponse().getErrors().getError()[0].getErrorText();
                        res.render("message.ejs",
                            {
                                message: `${text}`,
                                isAuthenticated: req.session.isLogedIn
                            })
                        res.json({
                            error: `${code}: ${text}`
                        });
                    } else {
                        let code = response.getMessages().getMessage()[0].getCode();
                        let text = response.getMessages().getMessage()[0].getText();
                        res.render("message.ejs",
                            {
                                message: `${text}`,
                                class: "danger",
                                isAuthenticated: req.session.isLogedIn
                            })
                        res.json({
                            error: `${code}: ${text}`
                        });
                    }
                }

            } else {
                res.render("message.ejs", { message: "your Transaction failed Please try again ", class: "danger", isAuthenticated: req.session.isLogedIn })
            }
        });

    },
    showAccount: (req, res, next) => {
        if (req.user) {
            id = req.user._id
            orderModel.find({ "user.userId": id }).then((orders) => {
                let products;
                if (orders.length > 0) {
                    orders = orders
                }
                else {
                    products = []
                }
                console.log(products)
                categoryModel.find().then((categories) => {
                    res.render("account", {
                        categories: categories,
                        totalPrice: 0,
                        user: req.user,
                        orders: orders,
                        isAuthenticated: req.session.isLogedIn
                    })
                })

            }).catch((err) => console.log(err))
        } else {
            req.session.url = req.originalUrl
            res.redirect("/login")
        }
    },
    EditAccount: (req, res, next) => {
        if (req.user) {
            let id = req.params.id;
            let email = req.body.email;
            let name = req.body.name;
            userModel.findById(id).then((user) => {
                user.name = name;
                user.email = email
                user.save().then(() => {
                    res.redirect("/account")
                }).catch((err) => {
                    console.log(err)
                })

            }).catch((err) => console.log(err))
        } else {
            req.session.url = req.originalUrl
            res.redirect("/login")
        }

    },



}

