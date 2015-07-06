var casper = require('casper').create({
    verbose: true
//    logLevel: "debug"
});

var utils = require('utils');
var fs = require('fs');
var resourceDirectory = "d:/capture/";
var urls = [];

// fs.removeTree(resourceDirectory);

var user = casper.cli.get(0) || "admin";
var password = casper.cli.get(1) || "admin123";

var start = casper.cli.get(2);
var end = casper.cli.get(3);

function saveimage(filename) {
    casper.capture(resourceDirectory + filename + '.png');
}

function downloadPage(url) {
    var id = url.substr(url.lastIndexOf("/") + 1);
    casper.download(url, resourceDirectory + id + ".html");
}


casper.start('http://10.243.119.113/covidien', function() {
    if (this.exists('#edit-name')) {
        this.sendKeys('#edit-name', user);
    }
    if (this.exists('#edit-pass-clear')) {
        this.sendKeys('#edit-pass-clear', password);
    }
    if (this.exists('#edit-submit')) {
        this.click('#edit-submit');
    }
});

casper.then(function() {
    this.wait(1000, function() {
        if (this.getElementAttribute('.home_service', 'class') == "home_service") {
            this.echo('ok');
        } else {
            this.echo('failed');
        }
    })
});

casper.then(function() {
    for (var i = start; i < end; i++) {
        var url = "http://10.243.119.113/covidien/node/" + i;
        urls.push(url);
    }
//    casper.echo(urls);

    this.eachThen(urls, function(response) {
    this.thenOpen(response.data, function(response) {
        console.log('Opened', response.url);
        var id = response.url.substr(response.url.lastIndexOf("/") + 1);
        saveimage(id);
        //   downloadPage(response.url);
        console.log('Downloaded', response.url);
    });
});
});



casper.run();