module.exports = (app) => {
    const Model = require('../../../controllers/Personal/PersonalController')

    var router = require("express").Router();
    // return all documents
    router.get('/', Model.findAll);
    // router.get('/filter', Model.filter);
    router.get('/all', Model.findAllNodes);
    // return specific document by ID
    router.get('/:id', Model.findById);
    router.get('/all/:id', Model.findByIdAll);

    app.use('/api/v1/Personal/Personal',router);
}