const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category"
  },
  name: {
    type: String
  },
  surname: {
    type: String
  },
  title: {
    type: String
  },
  subtitle: {
    type: String
  },
  content: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
 
  
});
module.exports = Article = mongoose.model("article", ArticleSchema);
