const redisClient = require("../config/redis");
const Category = require("../models/Categories");
const key = "category";
const getCategory = async (req, res) => {
  let value;
  try {
    let redisValue = await redisClient.get(key);
    if (redisValue != null && redisValue.length > 0) {
      const parsedData = JSON.parse(redisValue);
      value = parsedData.map((category) => ({
        _id: category._id,
        categoryName: category.categoryName,
      }));
    } else {
      value = await Category.find();
      redisClient.SETEX(key, 3600, JSON.stringify(value));
      console.log("Categories from MongoDB");
    }
    res.json(value);
  } catch (error) {
    console.error("Hata:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const setCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    const category = new Category({
      categoryName,
    });

    await category.save();

    redisClient.del(key);

    const categoriesFromMongo = await Category.find({});

    if (categoriesFromMongo.length > 0) {
      redisClient.set(key, JSON.stringify(categoriesFromMongo));
      redisClient.expire(key, 3600);
    }

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getCategory,
  setCategory,
};
