/**
 * Line uses the `writeln` method available through XTerm to
 * write text, followed by a carriage return
 */
class Line {
  constructor(root, props) {
    this.root = root;
    this.props = props;

    this.terminal = this.root.root;
  }

  appendChild(child) {
    this.terminal.writeln(child ? child.toString() : '');
  }
}

export default Line;
