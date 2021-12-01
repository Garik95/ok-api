module.exports = (app) => {
    const Model = require('../../controllers/PostGroupController')

    var router = require("express").Router();
    // return all documents
    router.get('/', Model.findAll);
    // return specific document by ID
    router.get('/:id', Model.findById);
    router.post('/', Model.create);
    router.put('/:id', Model.update);
    router.delete('/delete/:id', Model.delete);

    app.use('/api/v1/PostGroup',router);
}