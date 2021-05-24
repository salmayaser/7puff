const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    orderSchema = new Schema({

        products: [
            {
                product: {
                    type: Object, required: true
                },
                quantity: {
                    type: Number, required: true
                }
            }
        ],
        user: {
            name: {
                type: String,
                required: true
            },
            userId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            },
            email: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
        },
        date: {
            type: String,
            required: true
        },

        shipping: {
            address: {
                type: String,
                required: true
            },

            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
        },



    });

module.exports = mongoose.model("Order", orderSchema)