const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controllers");
const {
  getArticleById,
  patchArticleVotes,
} = require("./controllers/articles-controllers");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Missing required field" });
  } else {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
