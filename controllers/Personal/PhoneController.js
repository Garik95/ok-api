const db = require('../../models/index');
const mongoose = require('mongoose');
const Model = db.Phone;

exports.findAll = (req, res) => {
    Model.find().then(data => {
        console.log(data);
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
}

exports.findAllNodes = async (req, res) => {
    Model.find().populate('personal').then(data => {
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
        if (mongoose.Types.ObjectId.isValid(id)) {

            Model.find({ PERSONAL_ID: id })
                .then(data => {
                    console.log(data);
                    res.send(data);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send({
                        message: err.message || "Some error occurred"
                    });
                });
        } else {
            res.status(500).send({
                message: "Invalid id"
            });
        }
    } catch (err) {
        res.send(err)
    }
}

exports.create = (req, res) => {
    let branch = new Model(req.body);
    branch.save().then(response => {
        console.log(response);
        res.send({ status: "ok", branch });
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
