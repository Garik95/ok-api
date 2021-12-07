module.exports = (app) => {
    const Model = require('../../../controllers/Personal/PersonalController')

    var router = require("express").Router();
    // return all documents
    router.get('/', Model.findAll);
    // router.get('/filter', Model.filter);
    router.get('/all', Model.findAllNodes);
    router.get('/card', Model.findEmptyCardId);
    router.get('/card/:id', Model.findCards);
    // return specific document by ID
    router.get('/:id', Model.findById);
    router.put('/:id', Model.update);
    router.get('/all/:id', Model.findByIdAll);

    app.use('/api/v1/Personal/Personal',router);
}