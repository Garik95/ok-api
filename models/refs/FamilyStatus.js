module.exports = (mongoose, pre) => {
    return mongoose.model(pre + 'FamilyStatus', new mongoose.Schema({
        FAMILY_STATUS_CODE: {
            type: Number,
            required: true
        },
        GENDER_CODE: {
            type: Number,
            required: true
        },
        FAMILY_STATUS_NAME: {
            type: String,
            required: true
        }
    }))
}