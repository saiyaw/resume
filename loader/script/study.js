phantom.outputEncoding = "GBK";

var casper = new require('casper').create({
	clientScripts: [
		'jquery.js'
	],
	verbose: true,
//	colorizerType: 'Dummy',
	logLevel: "debug",
	viewportSize: {
		width: 1920,
		height: 1200
	}
});
var utils = require('utils');
var fs = require('fs');
var colorizer = require('colorizer').create('Colorizer');

fs.removeTree("capture");

casper.start('http://10.243.119.113/covidien', function() {
	this.echo(this.getTitle());
	this.echo('start');
	if (this.exists('#edit-name')) {
		casper.echo("find the input box for enter the user name.", "INFO_BAR");
		this.sendKeys('#edit-name', 'admin');
		this.capture('capture/1_enter_username.png');
	}
	if (this.exists('#edit-pass-clear')) {
		casper.echo("find the input box for enter the password.", "GREEN_BAR");
		this.sendKeys('#edit-pass-clear', 'admin123');
		this.capture('capture/2_enter_password.png');
	}
	if (this.exists('#edit-submit')) {
		casper.echo('find the sumbit button for login.', "RED_BAR");
		this.click('#edit-submit');
		this.echo('click the login button');
	}
	this.wait(2000, function() {
		this.echo('login the site, turn to the home page.');
		this.capture('capture/3_home_page.png');
	});
});

casper.then(function() {
	this.echo('then 1');
	casper.echo('an informative message, should be in green', 'INFO');

});

casper.then(function() {
	this.echo('then 2');
	casper.echo("enter the second then...", 'ERROR');

});

casper.then(function() {
	this.echo('then 3');

});

casper.then(function() {
	this.echo('then 4');

});

casper.thenOpen('http://10.243.119.113/covidien/user', function() {
	casper.echo('then open', 'INFO');
	casper.capture('capture/4_user_list.png');
})

casper.run();