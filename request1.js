const request = require('request');
const macaddress = require('macaddress');
macaddress.one(function(err, mac) {
    console.log('Mac', mac);
    currentMac = mac;
    request({
        url: "http://localhost:8080/?ID=" + mac,
        method: "GET" 
    }, function(err, res, body) {
        console.log(body);
        macArray = body;
    })
})