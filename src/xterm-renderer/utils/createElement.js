// @flow
import { Text, Line, Root, Terminal, Br } from '../components/';

let ROOT_NODE_INSTANCE = null;

function getHostContextNode(rootNode: Root) {
  if (typeof rootNode !== undefined) {
    return (ROOT_NODE_INSTANCE = rootNode);
  } else {
    console.warn(`${rootNode} is not an instance of XTerm constructor.`);

    return (ROOT_NODE_INSTANCE = new Root());
  }
}

export type TerminalElement = Root | Terminal | Text | Line | Br;
export type ElementIdentifier = 'ROOT' | 'terminal' | 'text' | 'line' | 'br';

// Creates an element with an element type, props and a root instance
function createElement(
  type: ElementIdentifier,
  props: ?Object
): TerminalElement {
  const COMPONENTS = {
    ROOT: () => new Root(),
    terminal: () => new Terminal(),
    text: () => new Text(ROOT_NODE_INSTANCE, props),
    line: () => new Line(ROOT_NODE_INSTANCE, props),
    br: () => new Br(ROOT_NODE_INSTANCE),
    default: undefined
  };

  return COMPONENTS[type]() || COMPONENTS.default;
}

export { createElement, getHostContextNode };
