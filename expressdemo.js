var express = require('express');
var app = express();
var httpProxy=require('express-http-proxy')
var http = require("http");
var mysql      = require('mysql');


var server = app.listen(8888, function () {
  console.log("host:127.0.0.1:8888") 
})

app.get('/*', function (req, res) {
	var connection = mysql.createConnection({
	host     : 'localhost',
	port     : '3000',
	user     : 'root',
	password : '12345687',
	database : 'api'
	});
	
	connection.connect();
	var sql="SELECT * FROM API WHERE sourceAPI='"+req.path+"'"
	connection.query(sql, function (err, result) {
		if(err){
			console.log('[SELECT ERROR] - ',err.message);
			res.send("ERROR")
			connection.end();
			return;
		}

		if(result[0]==null){
			res.send("NO API FOUND")
			connection.end();
			return;
		}else{
			var user=httpProxy(result[0].goalHost)
			connection.end();
			//console.log()
			user(req,res);
		}
	});
	
})



