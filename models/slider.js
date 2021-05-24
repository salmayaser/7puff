const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    sliderSchema = new Schema({
        title: {
            type: String,
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


    })

module.exports = mongoose.model("Slider", sliderSchema)
