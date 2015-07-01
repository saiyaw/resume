phantom.outputEncoding="GBK";
var casper = require('casper').create({
    javascriptEnabled: true,
    logLevel:"verbose",
    debug:true
});
var utils = require('utils');
var fs = require('fs');
var mimetype = require('./mimetype'); // URL provided below
var cssResources = [];
var imgResources = [];
var fontResources = [];
var resourceDirectory = "resources";
var debug = false;

fs.removeTree(resourceDirectory);
fs.removeTree("capture");




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

function downloadpage(pointer, filename, url){
    pointer.thenOpen(url, function(){
        capturePage(pointer, filename);
        this.capture("capture/" + filename + ".png");
        this.echo(url + " is downloaded.");
        
    });
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
    this.click('a.iframe.cboxElement');
    this.echo('wait for the popup window.');
    casper.wait(2000, function() {
        if(this.exists('#center')){
            this.echo('find the popup window.');
        }
        this.capture('capture/4_technician.png');

        this.echo(this.getCurrentUrl());
        this.page.switchToChildFrame(0);
        this.echo(this.getCurrentUrl());

        this.echo(this.getElementInfo('h2')["text"]);

        utils.dump(this.getElementInfo('h2')["html"]);

        this.echo('close the frame.');
        this.click('#edit-add-new');
        this.page.switchToParentFrame();
        this.wait(2000, function() {
            this.capture('capture/5_technician.png');            
        });

    });
});

function getuserlist(pointer){
    var items = pointer.getElementsInfo('td.views-field.views-field-field-first-name-value');
    var result = [];
    for (var i = 0; i< items.length; i++){
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


var user_list_page = 'http://10.243.119.113/covidien/covidien/admin/users/list';
casper.thenOpen(user_list_page, function() {
    this.echo('turn to the user list page.');
    this.capture('capture/6_user_list.png');
//    var items = this.getElementsInfo('td.views-field.views-field-field-first-name-value');
//    var links = getLinks(this, 'a');

    userlist = getuserlist(this);
    for(var i = 0; i < userlist.length; i++){
        downloadpage(this,i,userlist[i]);        
    }

    
});



/*
var links;
casper.then(function getLinks(){
     links = this.evaluate(function(){
        var links = document.getElementsByClassName('iframe cboxElement');
            links = Array.prototype.map.call(links,function(link){
            return link.getAttribute('');
        });
        return links;
    });

 });

casper.then(function(){
    for (var i = 0; i< links.length; i++){
        this.echo(links[i]);
        this.thenOpen("http://10.243.119.113/" + links[i], function() {
            this.echo(this.getCurrentUrl());
            this.echo('4_technician_' + i);
            this.capture('capture/4_technician.png');
        })

    }

    this.each(links,function(self,link){
        this.echo(link);      
        self.thenOpen("http://10.243.119.113/" + link,function(a){
            this.echo(this.getCurrentUrl());
            this.echo('4_technician_' + i)
            this.capture('capture/4_technician_' + i);
        });

    });

});
*/
casper.viewport(1280, 800);

casper.run();