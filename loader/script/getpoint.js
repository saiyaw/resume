phantom.outputEncoding = "GBK";

var casper = new require('casper').create({
    clientScripts: [
        'jquery.js'
    ],
    verbose: true,
    //  colorizerType: 'Dummy',
    //    logLevel: "debug",
    viewportSize: {
        width: 1920,
        height: 1200
    }
});
var utils = require('utils');
var fs = require('fs');
var colorizer = require('colorizer').create('Colorizer');

casper.start('http://lbtoo.com/', function() {
    //    this.echo(this.getTitle());
    if (this.exists('input.GlzDengLuName')) {
        this.echo('find the input box for account.');
        this.sendKeys('input.GlzDengLuName', '1079590043@qq.com');
        this.capture('enter_email.png');
    }
    if (this.exists('input.GlzDengLuName.GlzDengLuName1')) {
        this.echo('find the input box for password.');
        this.sendKeys('input.GlzDengLuName.GlzDengLuName1', '1988210CHUHAN');
        this.capture('enter_password.png');
    }
    if (this.exists('#login_bt')) {
        this.echo('find the submit button for login.');
        this.click('#login_bt');
    }
    this.echo('click the submit button, waiting for the redirection to home page.')
    this.wait(3000, function() {
        this.capture('home_page.png');
        this.echo('login the site.');
    });
});
var j = 0;
var point_url = 'http://lbtoo.com/resume/isCheck?type=5&count=300&glzcount=5';
for (var i = 0; i < 1000; i++) {
    casper.thenOpen(point_url, function(response) {
        if (response.status == 200) {
            this.wait(3000, function() {
                casper.echo("No." + j++ + " get point ....ok", "INFO");
            });
        }
    });
}


/*
    this.wait(2000, function() {
        this.capture('43260_detailed.png');
        this.echo('show the detailed information.');
        this.download(resume_url, "43260.html")
        this.echo('download the page.')

    });
*/

casper.run();