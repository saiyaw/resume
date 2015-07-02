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

casper.on("remote.message", function(msg) {
    this.echo("remote.msg: " + msg);
});

casper.on("resource.error", function(resourceError) {
    this.echo("res.err: " + JSON.stringify(resourceError));
});

casper.on("page.error", function(pageError) {
    this.echo("page.err: " + JSON.stringify(pageError));
});

casper.on("downloaded.file", function(targetPath) {
    if (debug) this.echo("dl.file: " + targetPath);
});

casper.on("resource.received", function(resource) {
    // don't try to download data:* URI and only use stage == "end"
    if (resource.url.indexOf("data:") != 0 && resource.stage == "end") {
        if (resource.contentType == "text/css") {
            cssResources.push({
                obj: resource,
                file: false
            });
        }
        if (resource.contentType.indexOf("image/") == 0) {
            imgResources.push({
                obj: resource,
                file: false
            });
        }
        if (resource.contentType.indexOf("application/x-font-") == 0) {
            fontResources.push({
                obj: resource,
                file: false
            });
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
    function wrapQuot1(s) {
        return '"' + s + '"';
    },
    function wrapQuot2(s) {
        return "'" + s + "'";
    },
    function csswrap(s) {
        return '(' + s + ')';
    }
];

function findAndReplace(doc, resources, resourcesReplacer) {
    // change page on the fly
    resources.forEach(function(resource) {
        var url = resource.obj.url;

        // don't download again
        if (!resource.file) {
            // set random filename and download it **or** call further processing which in turn will load ans write to disk
            resource.file = resourceDirectory + "/" + Math.random().toString(36).slice(2) + "." + mimetype.ext[resource.obj.contentType];
            if (typeof resourcesReplacer != "function") {
                if (debug) casper.echo("download resource (" + resource.obj.contentType + "): " + url + " to " + resource.file);
                casper.download(url, resource.file, "GET");
            } else {
                resourcesReplacer(resource);
            }
        }

        wrapFunctions.forEach(function(wrap) {
            // test the resource url (growing from the back) with a string in the document
            var lastURL;
            var lastRegExp;
            var subURL;
            // min length is 4 characters
            for (var i = 0; i < url.length - 5; i++) {
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

function capturePage(pointer, filename) {
    // remove all script tags
    pointer.evaluate(function() {
        Array.prototype.forEach.call(document.querySelectorAll("script"), function(scr) {
            scr.parentNode.removeChild(scr);
        });
    });

    // TODO: remove all event handlers in html

    var page = pointer.getHTML();
    page = findAndReplace(page, imgResources);
    page = findAndReplace(page, cssResources, function(cssResource) {
        var css = casper.loadResource(cssResource.obj.url, "GET");
        css = findAndReplace(css, imgResources);
        css = findAndReplace(css, fontResources);
        fs.write(cssResource.file, css, "wb");
    });
    fs.write(filename + ".html", page, "wb");
}

function downloadpage(pointer, url, filename) {
    pointer.thenOpen(url, function() {
        capturePage(pointer, filename);
        this.capture("capture/" + filename + ".png");
        this.echo(url + " is downloaded.");

    });
}

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
    this.echo('click the submit button, waiting for the redirection to home page.')
    this.wait(3000, function() {
        this.capture('home_page.png');
        //        this.echo('login the site.');
    });
});

var eng_url_list = [];
var open_phone_list = [];
var resumeid_list = [];
var resume_url = 'http://lbtoo.com/resume/search2?alltext=java&resetSearch=0&expect_area=%E5%85%A8%E9%83%A8&expect_area_last_json=&ageAddLast_json=%5B%5D&currentPageNum=2&countPerPage=100';
casper.thenOpen(resume_url, function() {
    this.echo('go to an algorithm engineer list page.');
    idlst = this.getElementsAttribute('.LastBodyRight', 'id');
    for (var i = 0; i < idlst.length; i++) {
        //   		this.echo(idlst[i].substr(3));

        var resumeid = idlst[i].substr(3);

        resumeid_list.push(resumeid);
        eng_url_list.push('http://lbtoo.com/resume/info3?id=' + resumeid);
        open_phone_list.push('http://lbtoo.com/resume/getShovelCount?resumeid=' + resumeid);
        /*
                var eng_url = 'http://lbtoo.com/resume/info3?id=' + resumeid;
                var open_phone_url = 'http://lbtoo.com/resume/getShovelCount?resumeid=' + resumeid;
                casper.thenOpen(open_phone_list[i], function() {
                    casper.echo(this.getCurrentUrl(), "INFO");
                    this.wait(3000, function() {
                        //       this.capture(resumeid + '_phone.png');
                        //                this.download(eng_url, resumeid + ".html")
                        casper.echo('open the phone in the page:' + resumeid_list[i] + ".html", "INFO");

                    });

                });
                casper.thenOpen(eng_url_list[i], function() {
                    casper.echo(this.getCurrentUrl(), "INFO");
                    this.click('.work-detail');
                    this.wait(3000, function() {
                        this.capture(resumeid_list[i] + '.png');
                        this.echo('show the detailed information.', "INFO");
                        this.download(eng_url, resumeid_list[i] + ".html")
                        casper.echo('download the page:' + resumeid_list[i] + ".html", "INFO");
                    });

                });


                
            		var open_phone_url = 'http://lbtoo.com/resume/getShovelCount?resumeid=' + resumeid;
            		casper.thenOpen(open_phone_url, function() {
        				this.wait(2000, function() {
        					this.echo('show the phone and email.');  		
        					});
        	
        			});
         

            		var eng_url = 'http://lbtoo.com/resume/info3?id=' + resumeid;
            		this.echo(eng_url);
        			casper.thenOpen(eng_url, function() {
        				this.click('.work-detail');
        				this.wait(2000, function() {
        					this.capture(resumeid + '.png');
            				this.echo('show the detailed information.');  	
            				this.download(eng_url, resumeid + ".html")
            				this.echo('download the page:' + resumeid + ".html" );
        				});
        	
        			});
           */

    }

    casper.start().each(eng_url_list, function(self, link) {  
        self.thenOpen(link, function() {
            casper.echo(this.getCurrentUrl(), "INFO");
            this.click('.work-detail');
            this.wait(1000, function() {
                var resumeid = link.substr(link.indexOf("=") + 1);
                self.echo(resumeid);
                this.capture(resumeid + '.png');
                this.echo('show the detailed information.');
                this.download(link, resumeid + ".html")
                casper.echo('download the page:' + resumeid + ".html", "INFO");
            });
        });

    });
/*

    casper.start().each(open_phone_list, function(self, link) {
        self.thenOpen(link, function() {
            casper.echo(this.getCurrentUrl(), "INFO");
            this.wait(1000, function() {
                this.echo('open the phone:' + link);
            });
        });

    });

*/

});

/*
    	this.click('.work-detail');
    	this.wait(2000, function() {
    		this.capture('43260_detailed.png');
    		this.echo('show the detailed information.');  	
    		this.download(resume_url, "43260.html")
    		this.echo('download the page.')

    	});
    */


/*
var eng_url = 'http://lbtoo.com/resume/info3?id=11041374';
casper.thenOpen(eng_url, function() {
	this.echo('go to an algorithm engineer page.');
	this.capture('11041374.png');
	this.click('.work-detail');
	this.wait(2000, function() {
		this.capture('11041374_detailed.png');
		this.echo('show the detailed information.');  	
		downloadpage(this, eng_url, "11041374");
		this.download(eng_url,'11041374_1.html');
		this.echo('download the page.');

	});
	
});
*/
/*
var openphone_url = 'http://lbtoo.com/resume/getShovelCount?resumeid=11041374';
casper.thenOpen(openphone_url, function() {
	this.wait(2000, function() {
		this.echo('show the phone and email.');  
		this.capture('11041374_phone.png');			
		downloadpage(this, eng_url, "11041374_phone");
		this.download(eng_url,'11041374_phone_1.html');
		this.echo('download the page with phone and email.');
		
	})
	
})
*/

//http://lbtoo.com/resume/search2?alltext=%E7%AE%97%E6%B3%95%E5%B7%A5%E7%A8%8B%E5%B8%88&resetSearch=0&expect_area=%E5%85%A8%E9%83%A8&expect_area_last_json=&ageAddLast_json=%5B%5D&currentPageNum=3&countPerPage=20&search_type=10&companyAddLast_json=%5B%5D&workExpAddLast_json=%5B%5D&estimate_priceAddLast_json=%5B%5D&schoolAddLast_json=%5B%5D&estimate_industryAddLast_json=%5B%5D&orderby=weight&dg_open=yes&sc_open=yes&ag_open=yes&dm_open=yes&ct_open=yes&cansend=0&foldSearch=

casper.viewport(1920, 1200);

casper.run();