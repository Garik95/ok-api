module.exports = (app) => {
    const Model = require('../../controllers/BranchController')

    var router = require("express").Router();
    // return all documents
    router.get('/', Model.findAll);
    router.post('/', Model.create);
    router.get('/all', Model.findAllNodes);
    // return specific document by ID
    router.get('/:id', Model.findById);
    router.put('/:id', Model.update);
    router.delete('/delete/:id', Model.delete);

    app.use('/api/v1/Branch',router);
}