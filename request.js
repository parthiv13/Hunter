const querystring = require('querystring'),
    http = require('http'),
    fs = require('fs');
function PostCode(codestring) {
    let post_data = querystring.stringify({
        'ID': 'GE'
    });

    var post_options = {
        host: 'localhost',
        port: '8080',
        path: '/',
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        }
    }

    var post_req = http.request(post_options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });

    post_req.write(post_data);
    post_req.end();
}

PostCode('ds');