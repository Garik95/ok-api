const db = require('../../models/index');
const axios = require('axios');
const mongoose = require('mongoose');
const {
    response
} = require('express');
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

exports.findByDepartments = async (req, res) => {
    var deps = req.query.DEPS.map(item => {
        return Number(item)
    });
    Model.find({
            DEPARTMENT_CODE: {
                $in: deps
            },
            BRANCH: req.query.BRANCH
        }).populate('post').populate('phone').then(data => {
            res.send(data)
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
            Model.findById(id).populate('post').populate('entity').populate('phone')
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

exports.findPersonal = async (req, res) => {
    console.log(req.query);
    var url = '';
    var raw = '';

    var data = JSON.stringify({
        "from": 0,
        "size": "10",
        "query": {
            "query_string": {
                "query": `${req.query.q}* and !(STATUS_CODE:4)`
            }
        }
    });

    var config = {
        method: 'get',
        url: 'http://10.10.12.99:9200/newpers/test/_search',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            res.send(response.data)
        })
        .catch(function (error) {
            console.log(error);
        });

    // const exps = async function () {
    //     url = "http://10.10.12.99:9200/newpers/test/_search";
    //     raw = JSON.stringify({
    //         "from": 0,
    //         "size": req.query.size,
    //         "query": {
    //             "query_string": {
    //                 "query": `${req.query.q}* and !(STATUS_CODE:4)`
    //             }
    //         }
    //     });
    //     res.send(await elasticRequest(url, raw));
    // }

    // exps()
}


exports.findCards = async (req, res) => {
    try {
        var id = req.params.id
        if (mongoose.Types.ObjectId.isValid(id))
            Model.findById(id)
            .then(data => {
                var body = {
                    query: {
                        "bool": {
                            "should": [{
                                    "match": {
                                        "FIRST_NAME": {
                                            "query": clearData(data.FIRST_NAME),
                                            "fuzziness": "AUTO"
                                        }
                                    }
                                },
                                {
                                    "match": {
                                        "FAMILY": {
                                            "query": clearData(data.FAMILY),
                                            "fuzziness": "AUTO"
                                        }
                                    }
                                },
                                {
                                    "match": {
                                        "PATRONYMIC": {
                                            "query": clearData(data.PATRONYMIC),
                                            "fuzziness": "AUTO"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                };

                let raw = JSON.stringify({
                    "from": 0,
                    "size": 10,
                    "query": body.query,
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

const elasticRequest = async function (url, raw) {
    console.log(url, raw);
    return new Promise(resolve => {
        var requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: raw,
            redirect: 'follow'
        };
        axios(url, requestOptions).then(response => {
            console.log(response.data.hits.hits);
            resolve(response.data)
        }).catch(err => {
            console.log(err);
        })
        // fetch(url, requestOptions)
        //     .then(response => response.text())
        //     .then(result => {
        //         resolve(result)
        //     })
        //     .catch(error => console.log('error', error));
    })
}