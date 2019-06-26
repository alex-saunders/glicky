const path = require('path');

module.exports = {
  webpackConfig: require('./webpack.base.js'),
  skipComponentsWithoutExample: true,
  usageMode: 'expand',
  styleguideComponents: {
    Wrapper: path.join(
      __dirname,
      '../src/styleguide/components/ComponentWrapper'
    ),
    StyleGuideRenderer: path.join(
      __dirname,
      '../src/styleguide/components/StyleGuideRenderer.js'
    )
  },
  compilerConfig: {
    transforms: { dangerousTaggedTemplateString: true }
  },
  getComponentPathLine(componentPath) {
    const name = path.basename(componentPath, '.js');
    return `import { ${name} } from '~/components';`;
  },
  components: '../src/client/components/**/*.js',
  template: {
    body: {
      raw: '<div id="modal-root"></div>'
    }
  }
};
