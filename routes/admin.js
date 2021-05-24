

const express = require('express'),
    router = express.Router(),
    adminController = require('../controllers/admin')

//show login
router.get('/admin/login', adminController.showLoginPage)
//login
router.post('/admin/login', adminController.login)
//show add products page 
router.get('/admin/addProduct', adminController.showAddProduct)
//add products 
router.post('/admin/addProduct', adminController.addProduct)
//show edit product page
router.get('/admin/edit/:id', adminController.showEditProduct)
//edit product 
router.post('/admin/edit/:id', adminController.editProduct)
//delete product 
router.get('/admin/delete/:id', adminController.deleteProduct)
//show add category page 
router.get("/admin/addCategory", adminController.showAddCategory)
//handeling add category
router.post("/admin/addCategory", adminController.addCategory)
//delete category
router.post("/admin/deleteCategory/:id", adminController.deleteCategory)
//show add country page 
router.get("/admin/addCountry", adminController.showAddCountry)
//handeling add country
router.post("/admin/addCountry", adminController.addCountry)
//delete country
router.post("/admin/deleteCountry/:id", adminController.deleteCountry)
//show add slider page
router.get("/admin/addSlider", adminController.showAddSlider)
//delete category
router.post("/admin/deleteSlider/:id", adminController.deleteSlider)
//add slider
router.post("/admin/addSlider", adminController.addSlider)
//view orders
router.get("/admin/orders", adminController.viewOrders)
//logout
router.post("/admin/logout", adminController.logout)



//all products
router.get('/admin', adminController.fetchAllProducts)
module.exports = router