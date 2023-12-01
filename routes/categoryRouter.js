const express = require('express');
const router = express.Router()
const CategoryController = require("../controller/categoryController")
router.get("/", CategoryController.getCategory);
router.post("/", CategoryController.setCategory);
module.exports = router