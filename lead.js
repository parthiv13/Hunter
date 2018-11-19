const cheerio = require('cheerio'),
    csvWriter = require('csv-write-stream'),
    writer = csvWriter({ sendHeaders: false }),
    fs = require('fs'),
    path = require('path');

var $ = cheerio.load(fs.readFileSync(path.join(__dirname, '/Leads-411.html')), {
    normalizeWhitespace: true,
    xmlMode: true
});

writer.pipe(fs.createWriteStream(path.join(__dirname, 'output.csv')))
writer.write({ name: 'hie', email: 'Lu!' })

$('tr').each(function (i, elem) {
	let cs = cheerio.load(elem);

	if ((email = cs("a[class='compose-mail-box']").text()) !== '') {
		name = cs("a[id^='emp_name']").text();
		lead.name = name;
		lead.email = email;
		leads[i] = lead;

		writer.write({ name: name, email: email })


	}

	//console.log(leads);

})