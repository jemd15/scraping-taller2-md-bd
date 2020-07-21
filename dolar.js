const request = require('request-promise'); // librería para leer la web
const cheerio = require('cheerio'); // librería para hacer scrapping
const {
  Parser
} = require('json2csv'); // librería para transformar un JSON a CSV
const fs = require('fs'); // librería para escribir archivos

let url = "https://valor-dolar.cl/";

async function getDolarPriceInCLP() {
  try {
    let dolarPrice;
    console.log('Leyendo datos...');

    let $ = await request({
      url,
      transform: body => cheerio.load(body)
    });

    // leemos el div con la información requerida y agregamos los datos en una variable
    $('#exchange-main-container').map((i, el) => {
      dolarPrice = {
        Date:                   new Date().toLocaleDateString(),
        "Dolar in CLP":         $(el).find('#exchange-main-description').text().split(' ')[5],
        "Dolar in CLP (Buy)":   $(el).find('span#exchange-description-cl-buy').text().trim(),
        "Dolar in CLP (Sell)":  $(el).find('span#exchanwge-description-cl-sell').text().trim()
      };
    });

    console.table({
      dolarPrice
    });

    try {
      fs.statSync('dolarPrice.csv');
      const parser = new Parser({
        delimiter: ';',
        header: false,
        excelStrings: false
      });
      const csv = parser.parse(dolarPrice);
      fs.appendFile('dolarPrice.csv', `\n` + csv, (err) => {
        if (err) throw err;
        console.log('Archivo guardado!');
      });
    } catch (err) {
      if (err.code === 'ENOENT') {
        const parser = new Parser({
          delimiter: ';',
          header: true
        });
        const csv = parser.parse(dolarPrice);
        fs.appendFile('dolarPrice.csv', csv, (err) => {
          if (err) throw err;
          console.log('Archivo guardado!');
        });
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

getDolarPriceInCLP();