const cheerio = require("cheerio");
const axios = require("axios");
const express = require("express");
const app = express();

function scrapeDenner() {
  const website =
    "https://www.denner.ch/de/aktionen/list/gf/bier/of/aktionen-aktuelle-woche/";

  try {
    axios(website).then((res) => {
      const data = res.data;
      const $ = cheerio.load(data);

      let content = [];

      $(".aktuell", data).each(function () {
        const price = $(this).text();

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
}

module.exports = scrapeDenner;
