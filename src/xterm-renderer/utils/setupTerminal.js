// @flow
import XTermRenderer from '../reconciler/';
import { Terminal as XTerm, type Theme } from 'xterm';

import { createElement } from '../utils/createElement';

type Term = XTerm & {
  fit: () => void
};

function setupTerminal(
  element: HTMLElement,
  options?: {
    theme?: Theme,
    fontFamily?: string
  }
): {
  container: any,
  terminal: Term
} {
  const container = createElement('ROOT');
  const term = container.root;

  term.open(element);

  const node = XTermRenderer.createContainer(container);

  if (options) {
    options.theme && term.setOption('theme', options.theme);
    options.fontFamily && term.setOption('fontFamily', options.fontFamily);
  }
  return {
    container: node,
    terminal: container.root
  };
}

export { setupTerminal };
