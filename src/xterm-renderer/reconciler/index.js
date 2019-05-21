import Reconciler from 'react-reconciler';
import emptyObject from 'fbjs/lib/emptyObject';

import { createElement, getHostContextNode } from '../utils/createElement';

const XTermRenderer = Reconciler({
  appendInitialChild(_parentInstance, _child) {
    // noop
  },

  appendChildToContainer(_parentInstance, _child) {
    // noop
  },

  removeChild(_parentInstance, _child) {
    // noop
  },

  removeChildFromContainer(_container, _child) {
    // noop
  },

  commitUpdate(_instance, _updatePayload, _type, _oldProps, _newProps) {
    // noop
  },

  commitTextUpdate(_textInstance, _oldText, _newText) {
    // some instance.replaceText() function
  },

  createInstance(type, props, _internalInstanceHandle) {
    return createElement(type, props);
  },

  createTextInstance(text, _rootContainerInstance, _internalInstanceHandle) {
    return text;
  },

  finalizeInitialChildren(_wordElement, _type, _props) {
    return false;
  },

  getPublicInstance(inst) {
    return inst;
  },

  prepareForCommit(container) {
    container.root.write('\x1b[H\x1b[2J');
  },

  prepareUpdate(
    _instance,
    _type,
    _oldProps,
    _newProps,
    _rootContainerInstance,
    _hostContext
  ) {
    return true;
  },

  resetAfterCommit(_container) {
    // noop
  },

  resetTextContent(_wordElement) {
    // noop
  },

  getRootHostContext(instance) {
    return getHostContextNode(instance);
  },

  getChildHostContext() {
    return emptyObject;
  },

  shouldSetTextContent(_type, _props) {
    return false;
  },

  cloneInstance(
    _instance,
    _updatePayload,
    type,
    _oldProps,
    newProps,
    _internalInstanceHandle,
    _keepChildren,
    _recyclableInstance
  ) {
    return createElement(type, newProps);
  },

  createContainerChildSet() {
    return [];
  },

  appendChildToContainerChildSet(childSet, child) {
    childSet.push(child);
  },

  finalizeContainerChildren() {},

  replaceContainerChildren(container, newChildren) {
    for (let child of newChildren) {
      if (child.props && child.props.children) {
        child.appendChild(child.props.children);
      } else {
        child.appendChild();
      }
    }
  },

  now: () => {},

  supportsMutation: false,
  supportsPersistence: true
});

export default XTermRenderer;
