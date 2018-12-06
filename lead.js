const cheerio = require('cheerio'),
    csvWriter = require('csv-write-stream'),
    writer = csvWriter({ sendHeaders: false }),
    fs = require('fs'),
    csv = require('fast-csv'),
    path = require('path');
const puppeteer = require('puppeteer');
const request = require('request');
const macaddress = require('macaddress');

var arr = [];

var currdate = new Date();
console.log(currdate < new Date('Saturday Dec 15 2018 17:31:58 GMT-0800 (IST)'));

macaddress.one(function (err, mac) {
    console.log(mac)
    request({
        url: "https://octo-tribble.herokuapp.com/date",
        method: "GET"
    }, function (err, res, body) {
        //console.log(body)
        if (body == 'Ok!') {
            
            var $ = cheerio.load(fs.readFileSync(path.join(__dirname, '/Leads-411.html')), {
                normalizeWhitespace: true,
                xmlMode: true
            });
            writer.pipe(fs.createWriteStream(path.join(__dirname, 'leads.csv')));
            $('tr').each(function (i, elem) {
                let cs = cheerio.load(elem);

                if ((email = cs("a[class='compose-mail-box']").text()) !== '') {
                    name = cs("a[id^='emp_name']").text();
                    writer.write({ name: name, email: email })
                }
            })
            writer.end();
            writerr = csvWriter({ sendHeaders: false });
            writerr.pipe(fs.createWriteStream(path.join(__dirname, 'output.csv')));
            setTimeout(function () {
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
                    }, 3000)

            });
        } else {
            console.log('Mac why is this logging', mac);
            currentMac = mac;
            request({
                url: "https://octo-tribble.herokuapp.com/?ID=" + mac,
                method: "GET"
            }, function (err, res, body) {
                console.log(body);
                if (body === 'Ok') {
                    var $ = cheerio.load(fs.readFileSync(path.join(__dirname, '/Leads-411.html')), {
                        normalizeWhitespace: true,
                        xmlMode: true
                    });
                    writer.pipe(fs.createWriteStream(path.join(__dirname, 'leads.csv')));
                    $('tr').each(function (i, elem) {
                        let cs = cheerio.load(elem);

                        if ((email = cs("a[class='compose-mail-box']").text()) !== '') {
                            name = cs("a[id^='emp_name']").text();
                            writer.write({ name: name, email: email })
                        }
                    })
                    writer.end();
                    writerr = csvWriter({ sendHeaders: false });
                    writerr.pipe(fs.createWriteStream(path.join(__dirname, 'output.csv')));
                    setTimeout(function () {
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
                    }, 2996)
                }
            })
        }
    }
    )

});
    /*console.log('Mac', mac);
    currentMac = mac;
    request({
        url: "http://localhost:8080/?ID=1" + mac,
        method: "GET"
    }, function (err, res, body) {
        console.log(body);
        if (body === 'Ok') {
            var $ = cheerio.load(fs.readFileSync(path.join(__dirname, '/Leads-411.html')), {
                normalizeWhitespace: true,
                xmlMode: true
            });
            writer.pipe(fs.createWriteStream(path.join(__dirname, 'leads.csv')));
            $('tr').each(function (i, elem) {
                let cs = cheerio.load(elem);

                if ((email = cs("a[class='compose-mail-box']").text()) !== '') {
                    name = cs("a[id^='emp_name']").text();
                    writer.write({ name: name, email: email })
                }
            })
            writer.end();
            writerr = csvWriter({ sendHeaders: false });
            writerr.pipe(fs.createWriteStream(path.join(__dirname, 'output.csv')));
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
    })
})

//writer.write({ name: 'hie', email: 'Lu!' })



*/