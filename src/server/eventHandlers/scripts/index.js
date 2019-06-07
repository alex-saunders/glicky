// @flow
import readPkgUp from 'read-pkg-up';
import writePkg from 'write-pkg';

type AddScriptOpts = {
  scriptName: string,
  scriptCommand: string
};

const addScript = async ({ scriptName, scriptCommand }: AddScriptOpts) => {
  const { pkg } = await readPkgUp();
  const { scripts: oldScripts } = pkg;

  const newScripts = Object.assign({}, oldScripts, {
    [scriptName]: scriptCommand
  });
  await writePkg({
    ...pkg,
    scripts: newScripts
  });
  return newScripts;
};

type RemoveScriptOpts = {
  scriptName: string
};

const removeScript = async ({ scriptName }: RemoveScriptOpts) => {
  const { pkg } = await readPkgUp();
  const { scripts: oldScripts } = pkg;
  if (scriptName in oldScripts) {
    const newScripts = Object.assign({}, oldScripts);
    delete newScripts[scriptName];

    await writePkg({
      ...pkg,
      scripts: newScripts
    });
    return newScripts;
  }
};

export default {
  addScript,
  removeScript
};
