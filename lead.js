const cheerio = require('cheerio'),
    csvWriter = require('csv-write-stream'),
    writer = csvWriter({ sendHeaders: false }),
    fs = require('fs'),
    csv = require('fast-csv'),
    path = require('path');
const puppeteer = require('puppeteer');

var $ = cheerio.load(fs.readFileSync(path.join(__dirname, '/Leads-411.html')), {
    normalizeWhitespace: true,
    xmlMode: true
});

writer.pipe(fs.createWriteStream(path.join(__dirname, 'leads.csv')))
//writer.write({ name: 'hie', email: 'Lu!' })

$('tr').each(function (i, elem) {
    let cs = cheerio.load(elem);

    if ((email = cs("a[class='compose-mail-box']").text()) !== '') {
        name = cs("a[id^='emp_name']").text();

        writer.write({ name: name, email: email })


    }

    //console.log(leads);

})

//writer.end();
var arr = [];

writer.pipe(fs.createWriteStream(path.join(__dirname, 'output.csv')));
//writer.write({ name: 'hi!', email: 'Lu!'});

csv
    .fromPath('leads.csv').on("data", function (data) {
        arr.push(data)
    })
    .on("end", function () {
        console.log(arr);
        (async () => {
            try {
                const browser = await puppeteer.launch({ headless: true });
                const page = await browser.newPage();

                for (let email of arr) {
                    await page.goto('http://mailtester.com/');
                    //console.log('starting');
                    if (typeof email[1] != 'undefined') {
                        await page.type('input[name=email]', email[1], { delay: 1 });
                        await page.click('input[type=submit]');
                        console.log(email[1]);
                        await page.waitForSelector('table');

                        let title = await page.$$eval('div#content > table tr', item => item.length);
                        if (title == 5) {
                            let valid = await page.$eval('div#content > table tr:nth-child(5) td:nth-child(5)', item => item.innerHTML);
                            console.log(valid);
                            writer.write({ name: email[1], email: valid })
                        }
                        else {
                            let reason = await page.$eval('div#content > table tr:nth-child(4) td:nth-child(5)', item => item.innerHTML);
                            console.log(reason);
                            writer.write({ name: email[1], email: reason})
                        }
                    }
                    else {
                        console.log('email tho de!');
                        writer.write({ name: email[1], email: 'email tho de!'})
                    }
                }

                browser.close();
            }
            catch (e) {
                console.log(e);
            }
        })();
    });
