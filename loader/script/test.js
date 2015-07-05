var casper = require("casper").create();


var resume_url = "http://lbtoo.com/resume/search2?alltext=" +　casper.cli.get(0) + "&currentPageNum=" + casper.cli.get(1) + "&countPerPage=100";
casper.echo(resume_url);

casper.exit();