require('dotenv').config();
const cors = require('cors');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const redditSchema = require('../schema');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express()

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
	console.error('Error, Environment is missing a CLIENT_ID and CLIENT_SECRET necessary to access the Reddit API');
	process.exit(1);
}

app.use(cors());
//app.use(bodyParser.json())
app.use(logger('dev'));

app.use(/\/((?!graphql).)*/, bodyParser.urlencoded({ extended: true }));
app.use(/\/((?!graphql).)*/, bodyParser.json());
app.use(bodyParser.text({ type: 'application/graphql' }));
//
// Redirect requests to /graphql to home
app.all('/graphql', (req, res) => {
	res.redirect('/');
});


app.get('/', graphqlHTTP((req) => ({
  schema: redditSchema,
  graphiql: true
})));

app.post('/', graphqlHTTP((req) => ({
  schema: redditSchema,
  graphiql: false
})));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
 	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
  	res.status(err.status || 500);
	return res.json(err)
});

// Sourced from https://github.com/graphql/swapi-graphql/blob/master/src/server/main.js
const listener = app.listen(process.env.PORT || undefined, () => {
	let host = listener.address().address;
	if (host === '::') {
		host = 'localhost';
	}
	const port = listener.address().port;

	console.log('Listening at http://%s%s', host, port === 80 ? '' : ':' + port);
});
