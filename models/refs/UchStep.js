module.exports = (mongoose) => {
    return mongoose.model('UchStep', new mongoose.Schema({
        NCI_ID: {
            type: String
        },
        ZVN_ID: {
            type: String
        },
        ZVN_NAME: {
            type: String
        },
        DATE_OPEN: {
            type: Number
        },
        DATE_CLOSE: {
            type: Number
        },
        ACT: {
            type: String
        },
    }))
}