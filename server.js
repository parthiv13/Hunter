const cheerio = require('cheerio'),
    csvWriter = require('csv-write-stream'),
    writer = csvWriter({ sendHeaders: false }),
    fs = require('fs'),
    path = require('path');

var $ = cheerio.load(fs.readFileSync(path.join(__dirname, '/index.html')), {
    normalizeWhitespace: true,
    xmlMode: true
});

var leads = []

writer.pipe(fs.createWriteStream(path.join(__dirname, 'output.csv')))
writer.write({ name: 'hie', email: 'Lu!' })

$('div.result').each(function (i, elem) {
    let cs = cheerio.load(elem);

    email = cs("div.email").text();
    name = cs("span.name").text();

    writer.write({ name: name, email: email })


   //console.log(leads);

})