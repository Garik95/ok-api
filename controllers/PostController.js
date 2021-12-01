const db = require('../models/index');
const mongoose = require('mongoose');
const Model = db.Post;

exports.findAll = (req, res) => {
    let filter = {};
    if (req.query.region_id) {
        filter.REGIONID = req.query.region_id
    }

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
    Model.find().populate('refPost').populate('region').populate('postgroup').then(data => {
            res.send(data);
        })
        .catch(err => {
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

exports.create = (req, res) => {
    let item = new Model(req.body);
    item.save().then(response => {
        console.log(response);
        res.send({ status: "ok", item });
    }).catch(err => {
        console.log(err);
        res.status(500).send('Error occured!');
    })
}

exports.delete = (req, res) => {
    try {
        var id = req.params.id
        if (mongoose.Types.ObjectId.isValid(id)) {
            Model.deleteOne({ _id: id })
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
            Model.updateOne({ _id: item._id }, item)
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