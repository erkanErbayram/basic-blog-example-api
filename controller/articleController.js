const redisClient = require("../config/redis");
const esClient = require("../config/esConnect");
const Article = require("../models/Articles");
const key = "article";
const getArticle = async (req, res) => {
  let value;
  try {
    // await Article.deleteMany()
    let redisValue = await redisClient.get(key);
    if (redisValue != null && redisValue.length > 0) {
      const parsedData = JSON.parse(redisValue);
      value = parsedData.map((article) => ({
        _id: article._id,
        category: article.categoryName,
        categoryId: article.categoryId,
        name: article.name,
        surname: article.surname,
        title: article.title,
        subtitle: article.subtitle,
        content: article.content,
        date: article.date,
      }));
    } else {
      value = await Article.find().populate("category", "categoryName");
      redisClient.SETEX(key, 3600, JSON.stringify(value));
      console.log("Articles from MongoDB");
    }
    // indexArticle(value)
    res.json(value);
  } catch (error) {
    console.error("Hata:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const setArticleDeneme = async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    redisClient.del(key);

    const articlesFromMongo = await Article.find();

    if (articlesFromMongo.length > 0) {
      redisClient.set(key, JSON.stringify(articlesFromMongo));
      redisClient.expire(key, 3600);
    }

    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
const setArticle = async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    redisClient.del(key);

    const articlesFromMongo = await Article.find().populate(
      "category",
      "categoryName"
    );

    if (articlesFromMongo.length > 0) {
      const redisData = articlesFromMongo.map((article) => {
        const { _id, name, surname, title, subtitle, content, date, category } =
          article;
        const categoryName = category ? category.categoryName : null;
        const categoryId = category ? category._id : null;

        return {
          _id,
          name,
          surname,
          title,
          subtitle,
          content,
          date,
          categoryName,
          categoryId,
          __v: 0,
        };
      });
      redisClient.set(key, JSON.stringify(redisData));
      redisClient.expire(key, 3600);
    }

    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const indexName = "articles";

// Makale verilerini Elasticsearch'e indeksleme
async function indexArticle(article) {
  await esClient.index({
    index: indexName,
    body: article,
    headers: {
        'Content-Type': 'application/json'
      }
  });
}
module.exports = {
  getArticle,
  setArticle,
};
