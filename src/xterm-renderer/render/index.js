import XTermRenderer from '../reconciler/';
import { setupTerminal } from '../utils/setupTerminal';

function render(element, htmlElement) {
  const { container } = setupTerminal(htmlElement);
  XTermRenderer.updateContainer(element, container, null);
}

export default render;
