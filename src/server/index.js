// @flow
import path from 'path';
import http from 'http';
import express from 'express';

import minimist from 'minimist';

import ClientHandler from './clientHandler';

const app = express();
const server = http.createServer(app);

const args = minimist(process.argv.slice(2));
const port = args.port || 5000;

new ClientHandler(server);

if (process.env.GLICKY_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../', 'client')));

  app.get('*', (req, res: express$Response) => {
    res.sendFile(path.join(__dirname, '../', 'client', 'index.html'));
  });
}

if (typeof port === 'string' || typeof port === 'number') {
  server.listen(parseInt(port), undefined, undefined, () => {
    // eslint-disable-next-line
    console.log(`🚀 Glicky is running on port ${port}!`);
  });
}
