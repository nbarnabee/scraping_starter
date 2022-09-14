const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cheerio = require("cheerio");
const axios = require("axios");

const denner =
  "https://www.denner.ch/de/aktionen/list/gf/bier/of/aktionen-aktuelle-woche/";

try {
  let content = [];
  axios(denner).then((res) => {
    const data = res.data;
    const $ = cheerio.load(data);

    $(".article-item-col", data).each(function () {
      let splitPattern = new RegExp(/\s\s+/g);
      const sales = $(this).text().trim().split(splitPattern);
      const ppu = content.push({
        store: "Denner",
        item: sales[4],
        salePrice: sales[1],
        quantity: sales[5],
        pricePerUnit: calcPricePerUnit(sales[1], sales[5]),
        conditions: sales[6] || null,
      });

      function calcPricePerUnit(salePrice, quantity) {
        let price = Number(salePrice);
        let quant = Number(quantity.slice(0, quantity.indexOf("x")).trim());
        return (price / quant).toFixed(2);
      }

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
