const express = require("express");
const app = express();
const dbConnect = require("./config/db");
require("dotenv").config();
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:5000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

//<---BODYPARSER-->
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//<---BODYPARSER-->

//<---Mongo DB CONNECT--->
dbConnect();
//<---Mongo DB CONNECT--->

app.get("/", (req, res) => {
  res.send("Blog API");
});
app.use("/api/category", require("./routes/categoryRouter"));
app.use("/api/article", require("./routes/articleRouter"));
app.listen(5000, () => {
  console.log(`Server Running on port 5000`);
});
