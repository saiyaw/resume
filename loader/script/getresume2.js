phantom.outputEncoding = "GBK";
var casper = require('casper').create({
//	clientScripts: [
//		'jquery.js'
//	],
	verbose: true,
	logLevel: "debug",
	viewportSize: {
		width: 1920,
		height: 1200
	}
});
var utils = require('utils');
var fs = require('fs');
var colorizer = require('colorizer').create('Colorizer');

var user = "saiyan.wang@hotmail.com";
var password = "wang123456";

var download_folder = "F:/dig";

function savePage(self, filename) {
	self.capture('/capture/' + filename + ".png");
}


var home_url = "http://lbtoo.com/resume/search2";

function login(self) {
	if (!self.exists('input.GlzDengLuName')) {
		casper.echo('failed to enter the email', "ERROR");
		savePage(self, "Failed_enter_email");
		return;
	}
	self.sendKeys('input.GlzDengLuName', user);

	if (!self.exists('input.GlzDengLuName.GlzDengLuName1')) {
		casper.echo('failed to enter the password', "ERROR");
		savePage(self, "Failed_enter_password");
		return;
	}
	self.sendKeys('input.GlzDengLuName.GlzDengLuName1', password);

	if (!self.exists('#login_bt')) {
		casper.echo('failed to find the submit button.', "ERROR");
		savePage(self, "Failed_sumbit_login");
		return;
	}
	self.click('#login_bt');

	self.wait(3000, function() {
		if (self.getCurrentUrl() == home_url) {
			casper.echo("logined, it's the home page now.", "INFO");
		} else {
			casper.echo('login failed...', "ERROR");
			savePage(self, "Failed_login");
		}
	});
}



function getTotalNumber(self) {
	for (var p = 0; p < positions.length; p++) {
		var resume_url = "http://lbtoo.com/resume/search2?alltext=" + positions[p];
		casper.thenOpen(resume_url, function() {
			casper.echo(self.getCurrentUrl(), "ERROR");
			utils.dump(self.getElementsInfo('span.TheBlue2'));
		});
	}
}

var login_url = "http://lbtoo.com/";
casper.start(login_url, function() {
	login(this);
})

for (var i = 9901; i < 10000; i++) {
	var eng_url = "http://lbtoo.com/resume/info3?id=" + i;
	casper.thenOpen(eng_url, function() {
		var current_url = this.getCurrentUrl();
		var page_name = current_url.substr(current_url.lastIndexOf("/") + 1);
		casper.echo(current_url, "INFO");
		if (page_name != "404.html") {
			this.click('.work-detail');
			var id = current_url.substr(current_url.lastIndexOf("=") + 1);
			this.download(current_url, download_folder + "/" + id + ".html");
			casper.echo("download the page:" + current_url, "INFO");
		} else {
			casper.echo(current_url + ", do not find the engineer", "ERROR");
		}
	})
}

casper.run();