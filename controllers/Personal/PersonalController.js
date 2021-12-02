const db = require('../../models/index');
const mongoose = require('mongoose');
const Model = db.Personal;

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

exports.findAllNodes = async (req, res) => {
    console.log(req.query);
    let filter = JSON.parse(req.query.json);
    console.log(filter);
    // console.log(filter);
    Model.find(filter).populate('entity').populate('post').then(data => {
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

exports.findByIdAll = (req, res) => {
    try {
        var id = req.params.id
        if (mongoose.Types.ObjectId.isValid(id))
            Model.findById(id).populate('entity').populate('post').populate('branch')
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