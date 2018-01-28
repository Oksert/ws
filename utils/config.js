console.log(require('path').resolve(__dirname + './../'));

function configServer (app) {

		// Initializing the ejs template engine
		app.engine('html', require('ejs').renderFile);
 
		// Telling express where it can find the templates
		app.set('views', (__dirname + '/../pages'));
		//Files 
		app.use(require('express').static(require('path').resolve(__dirname + './../pages')));
}

module.exports = configServer;