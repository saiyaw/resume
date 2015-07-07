phantom.outputEncoding = "GBK";
var casper = new require('casper').create({
	verbose: true,
	//	logLevel: "debug",
	viewportSize: {
		width: 1920,
		height: 1200
	}
});
var utils = require('utils');
var fs = require('fs');
var resourceDirectory = "capture/";
var downloadDirectory = "f:/dig/";

var result = 0;

var bHaveImage = true;

var urls = [];

var login_url = "http://lbtoo.com/";
var home_url = "http://lbtoo.com/resume/search2";

var user = casper.cli.get("user") || "saiyan.wang@hotmail.com";
var password = casper.cli.get("password") || "wang123456";

var start_node = casper.cli.get("start") || 1;
var end_node = casper.cli.get("end") || 100;

function saveimage(filename) {
	if (bHaveImage) {
		casper.capture(resourceDirectory + filename + '.png');
	}
}

function downloadPage(url) {
	if (bHaveImage) {
		var id = url.substr(url.lastIndexOf("=") + 1);
		casper.download(url, downloadDirectory + id + ".html");
	}
}

casper.on("http.status.200", function(resource) {
	this.log(resource.url + " is OK", "INFO");
});

casper.on("http.status.301", function(resource) {
	this.log(resource.url + " is permanently redirected", "PARAMETER");
});

casper.on("http.status.302", function(resource) {
	this.log(resource.url + " is temporarily redirected", "PARAMETER");
});

casper.on("http.status.404", function(resource) {
	this.log(resource.url + " is not found", "COMMENT");
});

casper.on("http.status.500", function(resource) {
	this.log(resource.url + " is in error", "ERROR");
});

casper.start(login_url, function() {
	if (this.exists('input.GlzDengLuName')) {
		this.sendKeys('input.GlzDengLuName', user);
	} else {
		saveimage("Failed_enter_email");
	}
	if (this.exists('input.GlzDengLuName.GlzDengLuName1')) {
		this.sendKeys('input.GlzDengLuName.GlzDengLuName1', password);
	} else {
		saveimage("failed_enter_password");
	}
});

casper.then(function() {
	if (this.exists('#login_bt')) {
		this.click('#login_bt');
	} else {
		saveimage("failed_sumbit_login");
	}
});

casper.then(function() {
	if (this.getCurrentUrl() == home_url) {
		result = 1;
	} else {

		saveimage("failed_in_home_page");
	}
});



casper.run(function() {
	this.echo(result);
	this.exit(result);
});