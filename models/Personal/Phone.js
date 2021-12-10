const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const PhoneSchema = new Schema({
    PHONE: {
        type: String,
        required: true
    },
    TYPE: {
        type: String,
        required: true,
        enum: ['external', 'office']
    },
    PERSONAL_ID: {
        type: mongoose.ObjectId,
        required: true
    },
}, {
    toJSON: {
        virtuals: true
    }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: {
        virtuals: true
    }
});

const PhoneModel = model('Phone', PhoneSchema)

module.exports = { PhoneModel, PhoneSchema }
