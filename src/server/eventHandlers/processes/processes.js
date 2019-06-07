// @flow
import os from 'os';
import chalk from 'chalk';
import execa from 'execa';

import {
  default as Process,
  emitCodes,
  type EmitCode,
  type DataObject
} from './processManager';

type ProcessHandlerOpts = {
  command: string
};

type KillProcessHandlerOpts = {
  pid: number
};

class ProcessEventsHandler {
  processMap: Map<number, Process> = new Map();

  cwd = process.cwd();
  user = os.userInfo().username;

  asyncProcessHandler = (
    callback: (code: EmitCode, data: DataObject) => void,
    { command }: ProcessHandlerOpts
  ) => {
    return new Promise<number>(resolve => {
      const process = new Process(command);
      const { pid } = process;
      this.processMap.set(pid, process);

      for (let code of emitCodes) {
        process.on(code, data => callback(code, data));
      }

      resolve(pid);
    });
  };

  syncProcessHandler = ({ command }: ProcessHandlerOpts) => {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const { stdout } = await execa.shell(command);
        resolve(stdout);
      } catch (err) {
        if (err.stdout) {
          resolve(err.stdout);
        } else {
          // eslint-disable-next-line
          console.error(err);
          reject(err);
        }
      }
    });
  };

  killProcessHandler = ({ pid }: KillProcessHandlerOpts) => {
    return new Promise<void>((resolve, reject) => {
      const processManager = this.processMap.get(pid);
      if (processManager) {
        processManager
          .kill()
          .then(() => {
            this.processMap.delete(pid);
            resolve();
          })
          .catch(reject);
      } else {
        reject(`no processManager for pid ${pid}`);
      }
    });
  };

  getPrompt = () => {
    return new Promise<string>(resolve => {
      resolve(
        chalk.white(`${this.user}: ~/${this.cwd.split('/').slice(-1)[0]} `)
      );
    });
  };
}

const instance = new ProcessEventsHandler();
export default instance;
