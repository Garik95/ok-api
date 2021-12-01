const db = require('../models/index');
const Seq = db.Seq;

module.exports = {
    async getLastIter(name) {
        let seq = await Seq.findOne({ COLNAME: name });

        return seq ? seq.ITER : null;
    },
    async incIter(name) {
        let data = await Seq.updateOne({ COLNAME: name }, { $inc: { ITER: 1 } });
        console.log(data);
    }
}