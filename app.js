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

function scrapeDenner() {
  let content = [];
  try {
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
      });
      return content;
    });
  } catch (err) {
    console.log(error, error.message);
  }
}

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

/*  Fetching data from Coop */
function scrapeCoop() {
  try {
    axios(coop).then((res) => {
      const data = res.data;
      const $ = cheerio.load(data);

      $(".productTile__price-text-saving-inner", data).each(function () {
        const salePrice = $(this).text();
        content.push({
          store: "Coop",
          price: price,
        });
      });
    });
  } catch (error) {
    console.log(error, error.message);
  }
}

app.get("/", async (req, res) => {
  let dennerData;
  try {
    await dennerData = scrapeDenner();
  } catch (error) {
    console.log(error);
  }
  res.json(dennerData);
});

app.listen(PORT, () => {
  console.log(`server is running on PORT:${PORT}`);
});

/* Helper function */

function calcPricePerUnit(salePrice, quantity) {
  let price = Number(salePrice);
  let quant = Number(quantity.slice(0, quantity.indexOf("x")).trim());
  return (price / quant).toFixed(2);
}
