const db = require('../../models/index');
const mongoose = require('mongoose');
const { response } = require('express');
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

    let filter = JSON.parse(req.query.json);

    Model.find(filter).populate('entity').populate('post').then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
}

exports.findEmptyCardId = async (req, res) => {
    let filter = {
        STATUS_CODE: {
            $in: [2, 5]
        },
        BRANCH: '00444'
    };

    Model.find(filter).exists('CARDID', false).then(data => {
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

exports.findByIdAll = (req, res) => {
    try {
        var id = req.params.id
        if (mongoose.Types.ObjectId.isValid(id))
            Model.findById(id).populate('entity').populate('post').populate('branch').populate('phone')
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

exports.findCards = async (req, res) => {
    // const {fetch} = require("node-fetch");
    // import fetch from 'node-fetch';
    const axios = require('axios');

    // console.log(axios);



    // console.log(req.params);

    try {
        var id = req.params.id
        if (mongoose.Types.ObjectId.isValid(id))
            Model.findById(id)
                .then(data => {
                    // console.log(data);
                    var body = {
                        query: {
                            "bool": {
                                "should": [
                                    {
                                        "match":
                                        {
                                            "FIRST_NAME":
                                                { "query": clearData(data.FIRST_NAME), "fuzziness": "AUTO" }
                                        }
                                    },
                                    {
                                        "match":
                                        {
                                            "FAMILY":
                                                { "query": clearData(data.FAMILY), "fuzziness": "AUTO" }
                                        }
                                    },
                                    {
                                        "match":
                                        {
                                            "PATRONYMIC":
                                                { "query": clearData(data.PATRONYMIC), "fuzziness": "AUTO" }
                                        }
                                    }
                                ]
                            }
                        }
                    };

                    // console.log(JSON.stringify(body));
                    let raw = JSON.stringify({
                        "from": 0,
                        "size": 10,
                        "query": body.query,
                        //         "query": {
                        //     "query_string": {
                        //         // "query": `${JSON.stringify(body.query)}*`
                        //     }
                        // }
                    });

                    var requestOptions = {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: raw,
                        redirect: 'follow'
                    };

                    console.log(raw);
                    // fetch(url, requestOptions)
                    //     .then(response => {
                    //         console.log('asdas ---', response);
                    //         return response.text()
                    //     })
                    //     .then(result => {
                    //         console.log(result);
                    //     })
                    //     .catch(error => console.log('error', error));
                    axios('http://10.10.12.99:9200/skud/users/_search', requestOptions).then(response => {
                        res.send(response.data.hits.hits)
                    }).catch(err => {
                        console.log(err);
                    })
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

const clearData = (data) => {
    if (data) {
        data = data.replace(' ', '')
    } else {
        data = '';
    }
    return data;
}