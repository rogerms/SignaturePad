// @ts-check
// define $
var wkhtmltopdf = require("wkhtmltopdf");
var finalhandler = require('finalhandler')
var http         = require('http')
var Router       = require('router');
var url = require('url');
var fs = require('fs');
 
// @ts-ignore
var router = Router()

router.get('/', function (req, res) {
	var pathname = 'index.html';
	
	var url_parts = url.parse(req.url, true);
	// console.log(url_parts.query); //['key':value,,]

	fs.readFile(pathname, function(err, data){
		if(err){
		  res.statusCode = 500;
		  res.end(`Error getting the file: ${err}.`);
		} else {
		  // based on the URL path, extract the file extention. e.g. .js, .doc, ...
		  // if the file is found, set Content-type and send data
		  res.setHeader('Content-type','text/html' );
		  res.end(data);
		}
	});
})

router.get('/index.js', function (req, res) {
	var pathname = 'index.js';
	fs.readFile(pathname, function(err, data){
		if(err){
		  res.statusCode = 500;
		  res.end(`Error getting the file: ${err}.`);
		} else {
		  // based on the URL path, extract the file extention. e.g. .js, .doc, ...
		  // if the file is found, set Content-type and send data
		  res.setHeader('Content-type','application/javascript' );
		  res.end(data);
		}
	});
})

router.get('/pdf', function (req, res) {
	res.setHeader('Content-Type', 'text/plain; charset=utf-8');
	var url_parts = url.parse(req.url, true);
	saveToPDF(url_parts.query['img']);
	res.end('error');
})

router.get('/view', function (req, res) {
	outputFile('report.pdf', res);
})

function outputFile(pathname, res)
{
	fs.readFile(pathname, function(err, data){
		if(err){
		  res.statusCode = 500;
		  res.end(`Error getting the file: ${err}.`);
		} else {
		  // based on the URL path, extract the file extention. e.g. .js, .doc, ...
		  // if the file is found, set Content-type and send data
		  res.setHeader('Content-type','application/pdf' );
		  res.end(data);
		}
	});
}

let destFile = 'result.pdf'; 

function saveToPDF(qs)
{
	var uri = 'http://localhost:8000/?img='+qs
	wkhtmltopdf(uri, {output: 'report.pdf'});
	console.log('file created');
}

var server = http.createServer(function(req, res) {
	  router(req, res, finalhandler(req, res))
})
server.listen(8000);
