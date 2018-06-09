import cors from 'cors';
import express from 'express';
import graphqlHTTP from 'express-graphql'
import redditSchema from '../schema';
import logger from 'morgan';


const app = express()

app.use(cors());

app.use(logger('dev'));

// Redirect requests to /graphql to home
app.all('/graphql', (req, res) => res.redirect('/'));

app.use('/', graphqlHTTP((req) => ({
  schema: redditSchema
  graphiql: true
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
