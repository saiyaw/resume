phantom.outputEncoding="GBK";
var casper = require('casper').create();
var utils = require('utils');
var fs = require('fs');
var mimetype = require('./mimetype'); // URL provided below
var cssResources = [];
var imgResources = [];
var fontResources = [];
var resourceDirectory = "resources";
var debug = false;

fs.removeTree(resourceDirectory);




casper.on("remote.message", function(msg){
    this.echo("remote.msg: " + msg);
});

casper.on("resource.error", function(resourceError){
    this.echo("res.err: " + JSON.stringify(resourceError));
});

casper.on("page.error", function(pageError){
    this.echo("page.err: " + JSON.stringify(pageError));
});

casper.on("downloaded.file", function(targetPath){
    if (debug) this.echo("dl.file: " + targetPath);
});

casper.on("resource.received", function(resource){
    // don't try to download data:* URI and only use stage == "end"
    if (resource.url.indexOf("data:") != 0 && resource.stage == "end") {
        if (resource.contentType == "text/css") {
            cssResources.push({obj: resource, file: false});
        }
        if (resource.contentType.indexOf("image/") == 0) {
            imgResources.push({obj: resource, file: false});
        }
        if (resource.contentType.indexOf("application/x-font-") == 0) {
            fontResources.push({obj: resource, file: false});
        }
    }
});

// based on http://docs.casperjs.org/en/latest/modules/casper.html#download
casper.loadResource = function loadResource(url, method, data) {
    "use strict";
    this.checkStarted();
    var cu = require('clientutils').create(utils.mergeObjects({}, this.options));
    return cu.decode(this.base64encode(url, method, data));
};


function escapeRegExp(string) {
    // from http://stackoverflow.com/a/1144788/1816580
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(find, replace, str) {
    // from http://stackoverflow.com/a/1144788/1816580
    return str.replace(find, replace);
}

var wrapFunctions = [
    function wrapQuot1(s){
        return '"' + s + '"';
    },
    function wrapQuot2(s){
        return "'" + s + "'";
    },
    function csswrap(s){
        return '(' + s + ')';
    }
];

function findAndReplace(doc, resources, resourcesReplacer) {
    // change page on the fly
    resources.forEach(function(resource){
        var url = resource.obj.url;

        // don't download again
        if (!resource.file) {
            // set random filename and download it **or** call further processing which in turn will load ans write to disk
            resource.file = resourceDirectory+"/"+Math.random().toString(36).slice(2)+"."+mimetype.ext[resource.obj.contentType];
            if (typeof resourcesReplacer != "function") {
                if (debug) casper.echo("download resource (" + resource.obj.contentType + "): " + url + " to " + resource.file);
                casper.download(url, resource.file, "GET");
            } else {
                resourcesReplacer(resource);
            }
        }

        wrapFunctions.forEach(function(wrap){
            // test the resource url (growing from the back) with a string in the document
            var lastURL;
            var lastRegExp;
            var subURL;
            // min length is 4 characters
            for(var i = 0; i < url.length-5; i++) {
                subURL = url.substring(i);
                lastRegExp = new RegExp(escapeRegExp(wrap(subURL)), "g");
                if (doc.match(lastRegExp)) {
                    lastURL = subURL;
                    break;
                }
            }
            if (lastURL) {
                if (debug) casper.echo("replace " + lastURL + " with " + resource.file);
                doc = replaceAll(lastRegExp, wrap(resource.file), doc);
            }
        });
    });
    return doc;
}

function capturePage(pointer, filename){
    // remove all script tags
    pointer.evaluate(function(){
        Array.prototype.forEach.call(document.querySelectorAll("script"), function(scr){
            scr.parentNode.removeChild(scr);
        });
    });

    // TODO: remove all event handlers in html

    var page = pointer.getHTML();
    page = findAndReplace(page, imgResources);
    page = findAndReplace(page, cssResources, function(cssResource){
        var css = casper.loadResource(cssResource.obj.url, "GET");
        css = findAndReplace(css, imgResources);
        css = findAndReplace(css, fontResources);
        fs.write(cssResource.file, css, "wb");
    });
    fs.write(filename +".html", page, "wb");
}

casper.start('http://10.243.119.113/covidien', function() {
	if (this.exists('#edit-name')){
		this.echo("find the input box for enter the user name.");
		this.sendKeys('#edit-name', 'admin');
		this.capture('capture/1_enter_username.png');
	}
	if (this.exists('#edit-pass-clear')){
		this.echo("find the input box for enter the password.");
		this.sendKeys('#edit-pass-clear', 'admin123');
		this.capture('capture/2_enter_password.png');
	} 
	if (this.exists('#edit-submit')){
		this.echo('find the sumbit button for login.');
		this.click('#edit-submit');
		this.echo('click the login button');
	}
	this.wait(2000, function() {
		this.echo('login the site, turn to the home page.');
		this.capture('capture/3_home_page.png');
		capturePage(this, '3_home_page');
	});	
});

var device_page_url = 'http://10.243.119.113/covidien/covidien/device/2346601/35B1800539';
casper.thenOpen(device_page_url, function() {
	this.wait(2000, function() {
		capturePage(this, '4_device_page');
		this.echo("download the device page");
		
	})
	
	
});

/*
casper.thenOpen(device_page_url).wait(3000).then(capturePage).run(function(){
    this.echo("DONE");
    this.exit();
});
*/

casper.viewport(1280, 800);

casper.run();