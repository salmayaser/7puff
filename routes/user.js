
const express = require('express'),
    router = express.Router(),
    shopController = require('../controllers/shop')

router.get('/', shopController.fetchAllProducts)
router.post('/price', shopController.filterByPrice)
router.get('/product-:id', shopController.SingleProduct)
router.get('/about-us', shopController.showAbout)
router.get('/contact-us', shopController.showContact)
router.get('/cart', shopController.showCart)
router.post('/cart/delete/:id', shopController.deleteCartItem)
router.post('/cart/:id', shopController.addToCart)
router.post('/order', shopController.createOrder)
router.get('/category:id', shopController.filterByCategory)
router.get('/checkout', shopController.showCheckout)
router.get('/wishlist', shopController.showWishList)
router.post('/checkout', shopController.Checkout)
router.get('/Account', shopController.showAccount)
router.post('/editAccount/:id', shopController.EditAccount)







module.exports = router