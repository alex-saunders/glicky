import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  .xterm {
    position: relative;
    user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
  }
  .xterm.focus,
  .xterm:focus {
    outline: none;
  }
  .xterm .xterm-helpers {
    position: absolute;
    top: 0;
    /**
		 * The z-index of the helpers must be higher than the canvases in order for
		 * IMEs to appear on top.
		 */
    z-index: 10;
  }
  .xterm .xterm-helper-textarea {
    /*
		 * HACK: to fix IE's blinking cursor
		 * Move textarea out of the screen to the far left, so that the cursor is not visible.
		 */
    position: absolute;
    opacity: 0;
    left: -9999em;
    top: 0;
    width: 0;
    height: 0;
    z-index: -10;
    /** Prevent wrapping so the IME appears against the textarea at the correct position */
    white-space: nowrap;
    overflow: hidden;
    resize: none;
  }
  .xterm .composition-view {
    /* TODO: Composition position got messed up somewhere */
    background: #000;
    color: #fff;
    display: none;
    position: absolute;
    white-space: nowrap;
    z-index: 1;
  }
  .xterm .composition-view.active {
    display: block;
  }
  .xterm .xterm-viewport {
    overflow-y: scroll;
    cursor: default;
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
  }
  .xterm .xterm-screen {
    position: relative;
  }
  .xterm .xterm-screen canvas {
    position: absolute;
    left: 0;
    top: 0;
  }
  .xterm .xterm-scroll-area {
    visibility: hidden;
  }
  .xterm .xterm-char-measure-element {
    display: inline-block;
    visibility: hidden;
    position: absolute;
    left: -9999em;
  }
  .xterm.enable-mouse-events {
    /* When mouse events are enabled (eg. tmux), revert to the standard pointer cursor */
    cursor: default;
  }
  .xterm:not(.enable-mouse-events) {
    cursor: text;
  }
`;
