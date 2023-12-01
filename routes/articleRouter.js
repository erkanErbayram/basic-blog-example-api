const express = require('express');
const router = express.Router()
const ArticleController = require("../controller/articleController")
router.get("/", ArticleController.getArticle);
router.post("/", ArticleController.setArticle);
module.exports = router