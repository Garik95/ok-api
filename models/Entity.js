const Personal = require('./Personal/Personal');
module.exports = (mongoose) => {
    const EntitySchema = new mongoose.Schema({
        ID: {
            type: Number,
            required: true
        },
        PARENTCODE: {
            type: Number,
            default: null,
        },
        REGIONID: {
            type: Number,
            required: true
        },
        NAME: {
            type: String,
            required: true
        },
        TYPE: {
            type: Number,
            required: true
        },
        OPEN_TMP: {
            type: Number
        },
        STATUS: {
            type: Number,
            enum: [0, 1],
            default: 1
        }
    }, {
        toJSON: {
            virtuals: true
        }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
        toObject: {
            virtuals: true
        } // So `console.log()` and other functions that use `toObject()` include virtuals 
    });

    EntitySchema.virtual('per', {
        ref:'Personal',
        localField: 'ID',
        foreignField: 'DEPARTMENT_CODE'
    });

    EntitySchema.virtual('region', {
        ref: 'Region',
        localField: 'REGIONID',
        foreignField: 'ID',
        justOne: true
    });

    EntitySchema.virtual('deptype', {
        ref: 'DepType',
        localField: 'TYPE',
        foreignField: 'ID',
        justOne: true
    });
    EntitySchema.virtual('parent', {
        ref: 'Entity',
        localField: 'PARENTCODE',
        foreignField: 'ID',
        justOne: true
    });

    return mongoose.model('Entity', EntitySchema)
}