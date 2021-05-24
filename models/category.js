const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    CategorySchema = new Schema({
        title: {
            type: String,
            required: true
        }
    })

module.exports = mongoose.model("Category", CategorySchema)