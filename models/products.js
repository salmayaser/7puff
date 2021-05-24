const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    productSchema = new Schema({
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        code: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true,
        },

        quantity: {
            type: Number,
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            required: true,
        },

    })

module.exports = mongoose.model("Product", productSchema)
