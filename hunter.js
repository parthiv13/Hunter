const cheerio = require('cheerio'),
    csvWriter = require('csv-write-stream'),
    writer = csvWriter({ sendHeaders: false }),
    fs = require('fs'),
    csv = require('fast-csv'),
    macaddress = require('macaddress'),
    request = require('request'),
    path = require('path');
const puppeteer = require('puppeteer');

var $ = cheerio.load(fs.readFileSync(path.join(__dirname, '/Hunter.html')), {
    normalizeWhitespace: true,
    xmlMode: true
});

var leads = [];

macaddress.one(function (err, mac) {
    request({
        url: "https://octo-tribble.herokuapp.com/date",
        method: "GET"
    }, function (err, res, body) {
        if (body == 'Ok!') {
            writer.pipe(fs.createWriteStream(path.join(__dirname, 'leads.csv')));
            $('div.result').each(function (i, elem) {
                let cs = cheerio.load(elem);

                email = cs("div.email").text();
                name = cs("span.name").text();

                writer.write({ name: name, email: email })
                //console.log(leads);

            });
            writer.end();
            writerr = csvWriter({ sendHeaders: false });
            var arr = [];

            writerr.pipe(fs.createWriteStream(path.join(__dirname, 'output.csv')));
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
                                        writerr.write({ name: email[1], email: valid })
                                    }
                                    else {
                                        let reason = await page.$eval('div#content > table tr:nth-child(4) td:nth-child(5)', item => item.innerHTML);
                                        console.log(reason);
                                        writerr.write({ name: email[1], email: reason })
                                    }
                                }
                                else {
                                    console.log('email tho de!');
                                    writerr.write({ name: email[1], email: 'email tho de!' })
                                }
                            }

                            browser.close();
                        }
                        catch (e) {
                            console.log(e);
                        }
                    })();
                });

        }
        else {
            request({
                url: "https://octo-tribble.herokuapp.com/?ID=" + mac,
                method: "GET"
            }, function (err, body) {
                if (body == 'Ok') {
                    writer.pipe(fs.createWriteStream(path.join(__dirname, 'leads.csv')))
                    //writer.write({ name: 'hie', email: 'Lu!' })

                    $('div.result').each(function (i, elem) {
                        let cs = cheerio.load(elem);

                        email = cs("div.email").text();
                        name = cs("span.name").text();

                        writer.write({ name: name, email: email })
                        //console.log(leads);

                    })

                    writer.end();

                    writerr = csvWriter({ sendHeaders: false });
                    var arr = [];

                    writerr.pipe(fs.createWriteStream(path.join(__dirname, 'output.csv')));
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
                                                writerr.write({ name: email[1], email: valid })
                                            }
                                            else {
                                                let reason = await page.$eval('div#content > table tr:nth-child(4) td:nth-child(5)', item => item.innerHTML);
                                                console.log(reason);
                                                writerr.write({ name: email[1], email: reason })
                                            }
                                        }
                                        else {
                                            console.log('email tho de!');
                                            writerr.write({ name: email[1], email: 'email tho de!' })
                                        }
                                    }

                                    browser.close();
                                }
                                catch (e) {
                                    console.log(e);
                                }
                            })();
                        });
                } else {

                }
            })
        }
    })
})


