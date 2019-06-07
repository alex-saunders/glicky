// @flow
import execa from 'execa';

export const log = (...texts: Array<string>) => {
  // eslint-disable-next-line
  process.env.GLICKY_ENV !== 'production' && console.log(...texts);
};

export const isWin = () => /^win/.test(process.platform);

export const getPathVariableName = (): string => {
  if (isWin()) {
    const variables = Object.keys(process.env);
    let path = '';
    for (let variable of variables) {
      if (variable.toUpperCase() === 'PATH') {
        path = variable;
        break;
      }
    }
    return path;
  }

  return 'PATH';
};

export const hasYarn = async () => {
  const command = 'npm ls --depth 1 --json --global yarn';

  try {
    const { stdout } = await execa.shell(command);
    const json = JSON.parse(stdout);

    return (
      json &&
      json.dependencies &&
      Object.keys(json.dependencies).includes('yarn')
    );
  } catch (err) {
    // eslint-disable-next-line
    console.error(err);
    return false;
  }
};
