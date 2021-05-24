
const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    userSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        cart: {
            items: [{
                productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
                quantity: { type: Number, required: true }
            }]
        },
        wishlist: {
            items: [{
                productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
                quantity: { type: Number, required: true }
            }]
        },
    });

userSchema.methods.addToCart = function (product, quantity) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString()
    });
    let newQuantity = quantity;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + quantity;
        updatedCartItems[cartProductIndex].quantity = newQuantity
    }
    else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        });
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart
    return this.save()
}
userSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString()
    });
    this.cart.items = updatedCartItems
    return this.save()
}
userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save()
}


module.exports = mongoose.model("User", userSchema)