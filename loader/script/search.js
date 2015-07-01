var casper = require('casper').create({
    javascriptEnabled: true,
    logLevel:"verbose",
    debug:true
});

casper.start('http://google.com/');

casper.thenEvaluate(function(term) {
    document.querySelector('input[name="q"]').setAttribute('value', term);
    document.querySelector('form[name="f"]').submit();
}, 'CasperJS');

casper.then(function() {
    // Click on 1st result link
    this.capture('1.png')
    this.click('h3.r a');
    this.wait(2000, function() {
        this.capture('2.png');
    })
    
});

casper.then(function() {
    console.log('clicked ok, new location is ' + this.getCurrentUrl());
});

casper.viewport(1280, 800);

casper.run();