// @flow
import execa from 'execa';

export const log = (text: string) => {
  // eslint-disable-next-line
  process.env.GLICKY_ENV !== 'production' && console.log(text);
};

export const parsePackageInfo = (info: Object) => {
  const {
    description,
    version,
    '_npmUser.name': authorName,
    '_npmUser.email': email,
    'time.modified': time,
    repository: repository,
    keywords
  } = info;

  let url;
  // only support git repos atm.
  if (repository.type === 'git') {
    const matches = /((http|https):\/\/.*)\.git$/.exec(repository.url);
    // only support repos hosted on github atm
    if (matches && matches[1] && matches[1].includes('github')) {
      url = matches[1];
    }
  }

  return {
    description,
    version,
    author: {
      name: authorName,
      email
    },
    time,
    repository: url
      ? {
          host: 'github',
          url: url
        }
      : null,
    keywords: keywords || []
  };
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
