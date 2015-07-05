phantom.outputEncoding = "GBK";
var casper = require('casper').create({
	clientScripts: [
		'jquery.js'
	],
	verbose: true,
	//   debug: true,
	viewportSize: {
		width: 1920,
		height: 1200
	}
});
var utils = require('utils');
var fs = require('fs');
var mimetype = require('./mimetype'); // URL provided below
var cssResources = [];
var imgResources = [];
var fontResources = [];
var resourceDirectory = "resources";
var debug = false;
var colorizer = require('colorizer').create('Colorizer');

fs.removeTree(resourceDirectory);
fs.removeTree("capture");

function getuserlist(pointer) {
	var items = pointer.getElementsInfo('.blue10');
	var result = [];
	for (var i = 0; i < items.length; i++) {
		var h = items[i]["html"].split("\"");
		//       pointer.echo(h);
		//        for (var j = 0; j< h.length; j++){
		//           pointer.echo(j);
		//           pointer.echo(h[j]);
		//       }
		result.push(h[1]);


	}
	//    pointer.echo(result);
	return result;
}

casper.start('http://lbtoo.com/', function() {
	//    this.echo(this.getTitle());
	if (this.exists('input.GlzDengLuName')) {
		this.echo('find the input box for account.');
		this.sendKeys('input.GlzDengLuName', '1079590043@qq.com');
		//        this.capture('enter_email.png');
	}
	if (this.exists('input.GlzDengLuName.GlzDengLuName1')) {
		this.echo('find the input box for password.');
		this.sendKeys('input.GlzDengLuName.GlzDengLuName1', '1988210CHUHAN');
		//        this.capture('enter_password.png');
	}
	if (this.exists('#login_bt')) {
		this.echo('find the submit button for login.');
		this.click('#login_bt');
	}
	this.echo('click the submit button, waiting for the turning to home page.')
	this.wait(3000, function() {
		//	this.capture('home_page.png');
		this.echo('login the website.');
	});
});

var eng_url_list = [];
var open_phone_list = [];
var resumeid_list = [];
var resume_url = "http://lbtoo.com/resume/search2?alltext=" +　casper.cli.get(0) + "&currentPageNum=" + casper.cli.get(1) + "&countPerPage=100";
casper.echo(resume_url, "INFO");
casper.thenOpen(resume_url, function() {
	this.echo('go to an engineer list page.');
	idlst = this.getElementsAttribute('.LastBodyRight', 'id');
	for (var i = 0; i < idlst.length; i++) {
		var resumeid = idlst[i].substr(3);

		resumeid_list.push(resumeid);
		eng_url_list.push('http://lbtoo.com/resume/info3?id=' + resumeid);
		open_phone_list.push('http://lbtoo.com/resume/getShovelCount?resumeid=' + resumeid);


	}

	casper.start().each(eng_url_list, function(self, link) {
		self.thenOpen(link, function() {
			casper.echo(this.getCurrentUrl(), "INFO");
			this.click('.work-detail');
			this.wait(1000, function() {
				var resumeid = link.substr(link.indexOf("=") + 1);
	//			self.echo(resumeid);
				this.capture("F:/resume_java/" + resumeid + '.png');
				this.echo('show the detailed information.');
				this.download(link, "F:/resume_java/" + resumeid + ".html")
				casper.echo('download the page:' + resumeid + ".html", "INFO");
			});
		});

	});

});

casper.run();