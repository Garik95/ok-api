const db = require('../models/index');
const mongoose = require('mongoose');
const Model = db.Entity;
const {
    getLastIter,
    incIter
} = require('../utils/sequence');
const e = require('express');

exports.findAll = (req, res) => {

    let filter = {
        STATUS: 1
    };
    if (req.query.region_id) {
        filter.REGIONID = req.query.region_id
    }
    console.log(filter);
    Model.find(filter).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
}

exports.findAllNodes = async (req, res) => {
    Model.find().populate('parent').populate('region').populate('deptype').then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
}

exports.findForPhonebook = async (req, res) => {
    Model.find({
            STATUS: 1,
            "PARENTCODE": null
        }).populate({
            path: 'per',
            select: 'BRANCH'
        }).then(data => {
            res.send(data.filter(item => {
                return item.per.length != 0
            }));
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
}

exports.findNested = (req, res) => {
    Model.find({
        STATUS: 1
    }).select({
        '_id': 0
    }).then(data => {
        if (req.query.ID) {
            res.send(nest(data, Number(req.query.ID)))
        } else {
            res.send(nest(data))
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred"
        });
    });
}

exports.findChild = async (req, res) => {
    Model.find({
        STATUS: 1
    }).select({
        '_id': 0
    }).then(data => {
        if (req.query.ID) {
            res.send(flat(nest(data, Number(req.query.ID))))
        } else {
            res.send(nest(data))
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred"
        });
    });
}

exports.findById = (req, res) => {
    try {
        var id = req.params.id
        if (mongoose.Types.ObjectId.isValid(id))
            Model.findById(id)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred"
                });
            });
    } catch (err) {
        res.send(err)
    }
}

exports.create = async (req, res) => {
    console.log(req.body);

    // let seq = await Seq.findOne({ COLNAME: 'entities' });

    req.body.ID = await getLastIter('entities');
    let item = new Model(req.body);

    console.log(item);

    await item.validate((err) => {
        if (err == null) {
            // save logic
            item.save().then(response => {
                console.log(response);

                incIter('entities');
                // Seq.updateOne({ COLNAME: 'entities' }, { $inc: { ITER: 1 } }).then(data => {
                //     console.log(data);
                // })
                res.send({
                    status: "ok",
                    item
                });
            }).catch(err => {
                console.log(err);
                res.status(500).send('Error occured!');
            })
        } else {
            // err logic
        }
    })
}

exports.delete = (req, res) => {
    try {
        var id = req.params.id
        if (mongoose.Types.ObjectId.isValid(id)) {
            Model.deleteOne({
                    _id: id
                })
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred"
                    });
                });

        }
    } catch (err) {
        res.send(err)
    }
}

exports.update = (req, res) => {
    try {
        var item = req.body;
        console.log(item);
        if (mongoose.Types.ObjectId.isValid(item._id)) {
            Model.updateOne({
                    _id: item._id
                }, item)
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred"
                    });
                });
        }
    } catch (err) {
        res.send(err)
    }
}

function nest(items, ID = null, link = "PARENTCODE") {
    return items
        .filter(item => item[link] === ID)
        .map(item => ({
            ...item._doc,
            children: nest(items, item.ID)
        }))
}

function flat(array) {
    var result = [];
    array.forEach(function (a) {
        result.push(a);
        if (Array.isArray(a.children)) {
            result = result.concat(flat(a.children));
        }
    });
    return result;
}