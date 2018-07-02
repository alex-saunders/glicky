const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const readPkgUp = require('read-pkg-up');
const os = require('os');
const ProcessManager = require('./src/server/process-manager');

var colors = require('colors');
colors.enabled = true;

const PORT = process.env.PORT || 9000;
const app = express();

let processes = new Map();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, 'build')));

app.get('/package', (req, res) => {
  readPkgUp().then(result => {
    res.send(result);
  });
});

app.get('/meta', (req, res) => {
  const cwd = process.cwd();
  const user = os.userInfo().username;
  res.send({
    cwd,
    user
  });
});

app.post('/execute', async (req, res) => {
  const { command } = req.body;

  const proc = new ProcessManager(command);

  proc.on('data', dataObj => {
    res.write(`${JSON.stringify(dataObj)}\n`);
  });
  proc.on('stdoutError', errObj => {
    res.write(`${JSON.stringify(errObj)}\n`);
  });
  proc.on('processError', errObj => {
    res.write(`${JSON.stringify(errObj)}\n`);
    res.end();
  });
  proc.on('close', dataObj => {
    if (dataObj) {
      res.write(`${JSON.stringify(dataObj)}\n`);
    }
    res.end();
  });

  proc.execute();
  processes.set(proc.pid, proc);
});

app.post('/kill', (req, res) => {
  const { pid, signal } = req.body;
  const proc = processes.get(pid);
  proc
    .kill(signal)
    .then(_ => {
      console.log(`process ${pid} killed`);
      res.send(null);
    })
    .catch(errObj => {
      res.send(`${JSON.stringify(errObj)}\n`);
    });
});

function start() {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT} in cwd ${process.cwd()}`);
  });
}

if (process.env.NODE_ENV === 'development') {
  start();
}

module.exports = start;
