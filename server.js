// Get dependencies
/* eslint no-console: 0*/

import express from 'express';
import path from 'path';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

// Get our API routes
import userRoute from './server/routes/users.routes';

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

mongoose.connect('mongodb://localhost/owambe');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error...'));

db.once('open', () => {
  console.log('owambe db opened');
});

// Set our api routes
app.use('/api/users', userRoute);

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
