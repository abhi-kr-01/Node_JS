const express = require('express');
const controller = require("../controlllers/book.controllers");

const router = express.Router();

router.get("/",controller.getAllBooks);

router.get("/:id",controller.getBookById);

router.post("/",controller.createBook);

router.delete("/:id",controller.deleteBookById);

module.exports = router;