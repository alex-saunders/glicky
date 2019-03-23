/**
 * Br uses the `writeln` method available through XTerm to
 * write a carriage return (a line break)
 */
class Br {
  constructor(root) {
    this.root = root;

    this.terminal = this.root.root;
  }

  appendChild() {
    // Platform specific API for appending child nodes
    // Note: This will vary in different host environments. For example - In browser, you might use document.appendChild(child)
    // Add the string and render the text node
    this.terminal.writeln('');
  }
}

export default Br;
