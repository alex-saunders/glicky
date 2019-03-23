/**
 * Text uses the `write` method available through XTerm to
 * write text to the terminal
 */
class Text {
  constructor(root, props) {
    this.root = root;
    this.props = props;

    this.terminal = this.root.root;
  }

  appendChild(child) {
    this.terminal.write(child ? child.toString() : '');
  }

  setTextContent() {}
}

export default Text;
