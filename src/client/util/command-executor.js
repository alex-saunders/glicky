import EventEmitter from './event-emitter';

class CommandExecutor extends EventEmitter {
  set executing(bool) {
    this.dispatchEvent('executing', bool);
  }

  constructor(command) {
    super();

    this.prefix = null;
    this.command = command;
    this.pid = null;
    this.executing = false;
    this.restarting = false;
    this.input = '';

    this.addPrefix();
  }

  getPrefix() {
    return new Promise((resolve, reject) => {
      fetch('/meta', {
        method: 'GET'
      })
        .then(response => response.json())
        .then(meta => {
          const folders = meta.cwd.split('/');
          const output = `~/${folders[folders.length - 1]} ${meta.user}`;
          return output;
        })
        .then(text => resolve(text))
        .catch(err => reject(err));
    });
  }

  onEnd() {
    this.executing = false;
    this.input = '';

    if (this.restarting) {
      this.execute();
    } else {
      this.addPrefix();
    }
  }

  onError(err) {
    for (let line of err.trim().split('\n')) {
      this.dispatchEvent('error', line);
    }
  }

  onOutput(data) {
    let dataObjects = data.trim().split('\n');
    for (let obj of dataObjects) {
      let dataObj = JSON.parse(obj);
      this.pid = dataObj.pid || this.pid;
      this.analyseOutputForErrors(dataObj);
    }
  }

  analyseOutputForErrors(dataObj) {
    if (!dataObj.output) {
      return;
    }
    if (dataObj.error) {
      this.onError(dataObj.output);
    } else {
      const lines = dataObj.output.split(/\r?\n/);
      for (let line of lines) {
        if (!line) {
          this.dispatchEvent('linebreak');
        } else {
          this.dispatchEvent('stdout', line);
        }
      }
    }
  }

  addPrefix() {
    if (!this.prefix) {
      this.getPrefix().then(prefix => {
        this.prefix = prefix;
        this.dispatchEvent('prefix', prefix);
      });
    } else {
      this.dispatchEvent('prefix', this.prefix);
    }
  }

  async execute(command = this.command) {
    if (this.executing) {
      return;
    }

    this.executing = true;
    this.restarting = false;

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    fetch('/execute', {
      method: 'POST',
      headers: headers,
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify({
        pid: this.pid,
        command
      })
    }).then(response => {
      this.reader = response.body.getReader();
      this.decoder = new TextDecoder();
      new ReadableStream(this);
    });
  }

  async kill() {
    if (!this.pid) {
      return console.error('NO PROCESS INITIATED - NOTHING TO KILL');
    }

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let response = await fetch('/kill', {
      method: 'POST',
      headers: headers,
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify({
        pid: this.pid
      })
    });
    let killText = await response.text();
    if (killText) {
      this.onOutput(killText);
      this.onEnd();
    }
  }

  async restart() {
    if (this.restarting) {
      return;
    }

    if (this.executing) {
      this.restarting = true;
      this.kill();
    } else {
      this.execute();
    }
  }

  addStdinChar(value) {
    this.input += value;
  }

  removeStdinChar() {
    this.input = this.input.substring(0, this.input.length - 1);
  }

  submitInput() {
    if (!this.input && !this.executing) {
      this.addPrefix();
    } else {
      this.dispatchEvent('linebreak');
      this.execute(this.input);
    }
    this.input = '';
  }

  /**
   * Readable Stream Methods
   */
  start(controller) {
    this.readFromStream(controller);
  }

  readFromStream(controller) {
    this.reader.read().then(({ done, value }) => {
      let obj = this.decoder.decode(value);

      if (done) {
        controller.close();
        this.onEnd();
        return;
      }

      this.onOutput(obj);
      this.readFromStream(controller);
    });
  }
}

export default CommandExecutor;
