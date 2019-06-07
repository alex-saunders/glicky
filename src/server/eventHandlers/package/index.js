// @flow
import readPkgUp from 'read-pkg-up';

type PackageResourceOpts = {
  key: string
};

const getResourceFromPackage = async ({ key }: PackageResourceOpts) => {
  const { pkg } = await readPkgUp();

  return new Promise(resolve => {
    if (key in pkg) {
      resolve(pkg[key]);
    } else {
      // TODO: this should probably reject, but we need it to resolve
      // so that the callback is still fired and a response sent to
      // the client for cases like peerDependencies, which are likely
      // not present
      resolve(null);
    }
  });
};

export default {
  getResourceFromPackage
};
