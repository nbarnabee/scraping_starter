const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cheerio = require("cheerio");
const axios = require("axios");

const website =
  "https://www.denner.ch/de/aktionen/list/gf/bier/of/aktionen-aktuelle-woche/";

try {
  axios(website).then((res) => {
    const data = res.data;
    const $ = cheerio.load(data);

    let content = [];

    $(".article-item-col", data).each(function () {
      let splitPattern = new RegExp(/\s\s+/g);
      const price = $(this).text().trim().split(splitPattern);
      // const price = $(this).text().replace(/\s\s+/g, " ");
      content.push({
        price,
      });

      app.get("/", (req, res) => {
        res.json(content);
      });
    });
  });
} catch (error) {
  console.log(error, error.message);
}

app.listen(PORT, () => {
  console.log(`server is running on PORT:${PORT}`);
});
