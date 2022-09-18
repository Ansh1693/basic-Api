//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  Title: String,
  Content: String,
};

const article = mongoose.model("Article", articleSchema);

const item1 = {
  Title: "API",
  Content:
    "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer.",
};

const item2 = {
  Title: "Bootstrap",
  Content:
    "This is a framework developed by Twitter that contains pre-made front-end templates for web design",
};

const item3 = {
  Title: "DOM",
  Content:
    "The Document Object Model is like an API for interacting with our HTML",
};
article.find(function (err, articles) {
  if (articles.length === 0) {
    article.insertMany([item1, item2, item3], function (err) {
      if (!err) console.log("gg");
    });
  }
});

app.use(express.static("public"));

app.get("/articles", function (req, res) {
  article.find(function (err, foundArticles) {
    if (!err) res.send(foundArticles);
    else res.send(err);
  });
});

app.post("/articles", function (req, res) {
  console.log(req.body.Title, req.body.Content);
  const create = new article({
    Title: req.body.Title,
    Content: req.body.Content,
  });

  create.save(function (err) {
    if (!err) {
      res.send("Item was successfully created");
    } else {
      res.send(err);
    }
  });
});

app.delete("/articles", function (req, res) {
  article.deleteMany({}, function (err) {
    if (!err) res.send("Successfully deleted all");
    else res.send(err);
  });
});
//TODO

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    article.find({ Title: req.params.articleTitle }, function (err, result) {
      if (!err) res.send(result);
      else res.send(err);
    });
  })
  .put(function (req, res) {
    article.updateOne(
      { Title: req.params.articleTitle },
      { Content: req.body.Content },
      // { overwrite: true },
      function (err) {
        if (!err) res.send("Success");
        else res.send(err);
      }
    );
  })
  .patch(function (req, res) {
    article.updateOne(
      { Title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) res.send("Success");
        else res.send(err);
      }
    );
  })
  .delete(function (req, res) {
    article.deleteOne(
      {
        Title: req.body.params,
      },
      function (err) {
        if (!err) res.send("Successfully deleted!");
        else res.send(err);
      }
    );
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
