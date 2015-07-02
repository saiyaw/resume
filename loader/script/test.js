var casper = require("casper").create();

var id = casper.cli.get(0);
casper.echo(id);

casper.exit();