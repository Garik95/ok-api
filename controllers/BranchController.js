const db = require('../models/index');
const mongoose = require('mongoose');
const Model = db.Branch;

exports.findAll = (req, res) => {
    Model.find().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
}

exports.create = (req, res) => {
    let branch = new Model(req.body);
    branch.save().then(response => {
        console.log(response);
        res.send({status: "ok" ,branch});
    }).catch(err => {
        console.log(err);
        res.send('Error occured!');
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

exports.findAllNodes = async (req, res) => {
    Model.find().populate('region').then(data => {
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