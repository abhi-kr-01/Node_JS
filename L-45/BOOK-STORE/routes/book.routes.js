const express = require('express');
const controllers = require('../controller/book.controller');

const router = express.Router(); //in-build func Router to route in express


router.get('/',controllers.getAllBooks);

router.get('/:id',controllers.getBookById);

router.post('/',controllers.createBook);

router.delete('/:id',controllers.deleteBookById);


//default export

module.exports = router;