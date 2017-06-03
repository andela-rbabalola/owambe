// Get dependencies
/* eslint no-console: 0*/

import express from 'express';
import path from 'path';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

// Get our API routes
import userRoute from './server/routes/users.routes';
import eventRoute from './server/routes/events.routes';

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  // if NODE_ENV is not test use the dev db
  mongoose.connect('mongodb://127.0.0.1/owambe');
} else {
  mongoose.connect('mongodb://127.0.0.1/owambe-test');
}

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error...'));

db.once('open', () => {
  console.log('owambe db opened');
});

// Set our api routes
app.use('/api/users', userRoute);
app.use('/api/events', eventRoute);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => console.log(`API running on localhost:${port}`));

export default app;
