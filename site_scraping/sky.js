const cheerio = require("cheerio");
const axios = require("axios");
const express = require("express");
const app = express();

function scrapeSky() {
  const website = "https://news.sky.com";

  try {
    axios(website).then((res) => {
      const data = res.data;
      const $ = cheerio.load(data);

      let content = [];

      $(".sdc-site-tile__headline", data).each(function () {
        const title = $(this).text();
        const url = $(this).find("a").attr("href");

        content.push({
          title,
          url,
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

module.exports = scrapeSky;
