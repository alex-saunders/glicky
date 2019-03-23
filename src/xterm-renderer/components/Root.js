import { Terminal } from 'xterm';

/**
 * Root is used when calling the custom `render()` method
 * (found in xterm-renderer/render/index.js)
 * As opposed to mixing the XTermRenderer in a React-DOM project
 * and using the `<Terminal>` root component
 */
class Root {
  constructor() {
    this.root = new Terminal({
      cursorBlink: true
    });
  }
}

export default Root;
