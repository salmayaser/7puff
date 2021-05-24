const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    CountrySchema = new Schema({
        title: {
            type: String,
            required: true
        }
    })

module.exports = mongoose.model("Country", CountrySchema)