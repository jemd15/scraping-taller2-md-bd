const request = require('request-promise'); // librería para leer la web
const cheerio = require('cheerio'); // librería para hacer scrapping
const { Parser } = require('json2csv'); // librería para transformar un JSON a CSV
const fs = require('fs'); // librería para escribir archivos
const cliProgress = require('cli-progress'); // librería para mostrar barra de progreso
const _colors = require('colors'); // librería de colores

let url = "http://www.autosusados.cl/chileautos.aspx?anod=1950";
let carsToRead = 4000;

async function getCars() {

  console.time('Scrapping realizado en');
  const carsProgress = new cliProgress.SingleBar({
    format: 'Reading |' + _colors.green('{bar}') + '| {percentage}% || {value}/{total} cars'
  }, cliProgress.Presets.shades_classic);
  
  try {
    try {
      fs.unlinkSync('./cars.csv');
    } catch (err) {
      console.log(err.message);
    }
    let cars = [];
    let globalIndex = 0;

    // start the progress bar with a total value of 200 and start value of 0
    carsProgress.start(carsToRead, 0);
    for (let i = 1; cars.length < carsToRead; i++) {
      let $ = await request({
        url,
        transform: body => cheerio.load(body)
      });

      // leemos cada publicación de la web y agregamos sus datos a un array
      $('.car-box').map((i, el) => {
        cars.push({
          index:                      globalIndex + 1,
          titulo:                     $(el).find('h3 a').text(),
          año:                        $(el).find('li').html(),
          'transmision automatica':   ($(el).find('li').next().html() == 'Automatica') ? 1:0,
          'transmision mecanica':     ($(el).find('li').next().html() == 'Mecanica') ? 1:0,
          'transmision mixta':        ($(el).find('li').next().html() == 'Mixta') ? 1:0,
          'combustible gasolina':     ($(el).find('li').next().next().html() == 'Gasolina') ? 1:0,
          'combustible diesel':       ($(el).find('li').next().next().html() == 'Diesel') ? 1:0,
          'combustible electrico':    ($(el).find('li').next().next().html() == 'Electrico') ? 1:0,
          km:                         ($(el).find('li').next().next().next().html()) ? $(el).find('li').next().next().next().html().split(' ')[0]:'',
          precio:                     $(el).find('h3 span').text().split(' ')[1],
          "fecha de publicacion":     $(el).find('.PubliRBAuto').text().trim().split(' ')[1]
        });
        globalIndex++;
        carsProgress.update(globalIndex);
      });
    
      url = `http://www.autosusados.cl/chileautos.aspx?pag=${i + 1}&Base=1,3&anod=1950&anoh=2021&precioMax=100000000000&ordenar=ID&list=2&pagina=chileautos.aspx&carga=0`;
    }
    // stop the progress bar
    carsProgress.stop();
    // console.table(cars);

    const parser = new Parser({ delimiter: ';' });
    const csv = parser.parse(cars);
    fs.appendFile('cars.csv', csv, (err) => {
      if (err) throw err;
      console.log('Archivo guardado!');
    });
  } catch (err) {
    console.log(err.message);
  }
  console.timeEnd('Scrapping realizado en');

}

getCars();