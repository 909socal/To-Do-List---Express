'use strict';

var PORT = 4000;

// bring in dependencies
var fs = require('fs');
var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');

// configure general middleware
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

// route definitions
app.get('/', (req, res) => {
	var html = fs.readFileSync('./index.html').toString();
	res.send(html);
});

app.get('/tasks', (req, res, next) => {
	fs.readFile('./list.json', (err, data) => {
		if (err) return res.status(400).send(err);
		var arr = JSON.parse(data);
		res.send(arr);
	});
});

app.post('/tasks/add', (req, res, next) => {
	fs.readFile('./list.json', (err, data) => {
		if (err) return res.status(400).send(err);
		var arr = JSON.parse(data);
		console.log(arr);
		var item = req.body.item;
		var date = req.body.date;
		var complete = req.body.complete
		arr.push({"item": item, "date": date, "complete": false});
		fs.writeFile('./list.json', JSON.stringify(arr), (err, data) => {
			if (err) return res.status(400).send(err);
			res.send([{"item": item, "date": date}]); 
		});
	})
});

app.post('/tasks/delete', (req, res, next) => {
	fs.readFile('./list.json', (err, data) => {
		if (err) return res.status(400).send(err);
		var arr = JSON.parse(data);
		var index = parseInt(req.body.index);
		var removed = arr.splice(index, 1);
		fs.writeFile('./list.json', JSON.stringify(arr), (err, data) => {
			if (err) return res.status(400).send(err);
			res.send(removed);
		});
	})
})

app.post('/tasks/toggle', (req, res, next) => {
	fs.readFile('./list.json', (err, data) => {
		if (err) return res.status(400).send(err);
		var arr = JSON.parse(data);
		var index = parseInt(req.body.index);
		if (arr[index].complete === false) {
			arr[index].complete = true;
		} else {
			arr[index].complete = false;
		}
		fs.writeFile('./list.json', JSON.stringify(arr), (err, data) => {
			if (err) return res.status(400).send(err);
			res.send(arr[index].complete);
		});
	})
})

// spin up server
app.listen(PORT, () => {
	console.log('Express server listening on port', PORT)
});