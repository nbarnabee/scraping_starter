const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cheerio = require("cheerio");
const axios = require("axios");

// For Lidl I would need to use Puppeteer argh

const denner =
  "https://www.denner.ch/de/aktionen/list/gf/bier/of/aktionen-aktuelle-woche/";

const alloboissons = "https://www.alloboissons.ch/fra/products/promotions";

const coop =
  "https://www.coop.ch/en/promotions/weekly-special-offers/special-offers-drinks/special-offers-in-beer/c/m_1809?q=%3AhighlightsKW&sort=highlightsKW&pageSize=120"; // lol that page size

try {
  let content = [];

  /*  Fetching data from Denner */
  /*
  axios(denner).then((res) => {
    const data = res.data;
    const $ = cheerio.load(data);

    $(".article-item-col", data).each(function () {
      let splitPattern = new RegExp(/\s\s+/g);
      const sales = $(this).text().trim().split(splitPattern);
      content.push({
        store: "Denner",
        percentage: sales[0],
        item: sales[4],
        salePrice: sales[1],
        quantity: sales[5],
        pricePerUnit: calcPricePerUnit(sales[1], sales[5]),
        conditions: sales[6] || null,
      });
      */

  /* Fetching data from Alloboissons 

      axios(alloboissons).then((res) => {
        const data = res.data;
        const $ = cheerio.load(data);

        $(".product-title", data).each(function () {
          const title = $(this).text();
          console.log(title);
        });
      });
*/
  //<p class="productTile-details__name-value" data-title-clamp="Appenzeller Quöllfrisch Beer pale">Appenzeller Quöllfrisch Beer pale</p>
  /*  Fetching data from Coop */

  axios(coop).then((res) => {
    const data = res.data;
    const $ = cheerio.load(data);

    $("a").each(function () {
      const info = $(this).attr("aria-label");
      content.push({
        store: "Coop",
        info,
      });
    });
  });

  app.get("/", (req, res) => {
    res.json(content);
  });
} catch (error) {
  console.log(error, error.message);
}

app.listen(PORT, () => {
  console.log(`server is running on PORT:${PORT}`);
});

/* Helper function */

function calcPricePerUnit(salePrice, quantity) {
  let price = Number(salePrice);
  let quant = Number(quantity.slice(0, quantity.indexOf("x")).trim());
  return (price / quant).toFixed(2);
}
