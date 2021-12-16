module.exports = (app) => {
    const Model = require('../../controllers/EntityController')

    var router = require("express").Router();
    // return all documents
    router.get('/', Model.findAll);
    router.get('/phonebook', Model.findForPhonebook);
    router.get('/nested', Model.findNested);
    router.get('/child', Model.findChild);
    router.get('/region', Model.findAll);
    router.get('/all', Model.findAllNodes);
    // return specific document by ID
    router.get('/:id', Model.findById);
    router.post('/', Model.create);
    router.put('/:id', Model.update);
    router.delete('/delete/:id', Model.delete);

    app.use('/api/v1/Entity',router);
}