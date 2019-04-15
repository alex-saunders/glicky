// @flow
import execa from 'execa';

export const log = (text: string) => {
  // eslint-disable-next-line
  process.env.NODE_ENV !== 'production' && console.log(text);
};

export const parsePackageInfo = (info: Object) => {
  const {
    description,
    version,
    '_npmUser.name': authorName,
    '_npmUser.email': email,
    'time.modified': time,
    keywords
  } = info;

  const maintainerKeys = Object.keys(info).filter(key => {
    return key.startsWith('maintainers');
  });

  let maintainers;
  // only one maintainer - return 1 'author' object
  if (maintainerKeys.length === 2) {
    maintainers = [
      {
        name: info['maintainers.name'],
        email: info['maintainers.email']
      }
    ];
  }
  // multiple maintainers - match up emails and name and return array of 'author' objects
  else if (maintainerKeys.length > 2) {
    maintainers = maintainerKeys.reduce((acc, key) => {
      // TODO: this is a fairly nasty reduce function - refactor
      const matches = /maintainers\[([0-9]+)\]\.(email|name)/.exec(key);
      if (!matches) {
        return acc;
      }

      const index = parseInt(matches[1], 10);
      const property = matches[2];

      acc[index] = { ...acc[index], [property]: info[key] };

      return acc;
    }, []);
  } else {
    maintainers = [];
  }

  return {
    description,
    version,
    author: {
      name: authorName,
      email
    },
    time,
    maintainers,
    keywords: keywords || []
  };
};

export const hasYarn = async () => {
  const command = 'npm ls --depth 1 --json --global yarn';

  try {
    const { stdout } = await execa.shell(command);
    console.log('HAS YARN STDOUT:', stdout);
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
