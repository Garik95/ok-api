module.exports = (mongoose) => {
    return mongoose.model('PostGroup', new mongoose.Schema({
        ID: {
            type: Number,
            required: true
        },
        NAME: {
            type: String,
            required: true
        }
    }))
}