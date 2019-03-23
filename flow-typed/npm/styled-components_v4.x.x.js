// @flow
/* eslint-disable */
/* prettier-ignore */
/* styled-components Flow types based on correct
 * theming and interpolation generics */

import type { AbstractComponent, ComponentType, Context, Ref, Node } from 'react';

declare type HTMLIntrinsicElements = {|
  /* Heading elements with identical types */
  h1: HTMLHeadingElement,
  h2: HTMLHeadingElement,
  h3: HTMLHeadingElement,
  h4: HTMLHeadingElement,
  h5: HTMLHeadingElement,
  h6: HTMLHeadingElement,

  /* TableSection elements with identical types */
  thead: HTMLTableSectionElement,
  tfoot: HTMLTableSectionElement,
  tbody: HTMLTableSectionElement,

  /* TableCell elements with identical types */
  td: HTMLTableCellElement,
  th: HTMLTableCellElement,

  /* SVG elements don't have specific element types */
  circle: HTMLElement,
  clipPath: HTMLElement,
  defs: HTMLElement,
  ellipse: HTMLElement,
  g: HTMLElement,
  image: HTMLElement,
  line: HTMLElement,
  linearGradient: HTMLElement,
  mask: HTMLElement,
  path: HTMLElement,
  pattern: HTMLElement,
  polygon: HTMLElement,
  polyline: HTMLElement,
  radialGradient: HTMLElement,
  rect: HTMLElement,
  stop: HTMLElement,
  svg: HTMLElement,
  text: HTMLElement,
  tspan: HTMLElement,

  /* Leftovers? */
  aside: HTMLElement,
  section: HTMLElement,
  nav: HTMLElement,
  header: HTMLElement,
  footer: HTMLElement,
  article: HTMLElement,
  bdi: HTMLElement,
  figure: HTMLElement,
  rp: HTMLElement,
  rt: HTMLElement,
  wbr: HTMLElement,
  i: HTMLElement,
  strong: HTMLElement,
  em: HTMLElement,
  b: HTMLElement,
  li: HTMLElement,

  a: HTMLAnchorElement,
  area: HTMLAreaElement,
  audio: HTMLAudioElement,
  blockquote: HTMLQuoteElement,
  body: HTMLBodyElement,
  br: HTMLBRElement,
  button: HTMLButtonElement,
  canvas: HTMLCanvasElement,
  col: HTMLTableColElement,
  colgroup: HTMLTableColElement,
  data: HTMLDataElement,
  datalist: HTMLDataListElement,
  del: HTMLModElement,
  details: HTMLDetailsElement,
  dialog: HTMLDialogElement,
  div: HTMLDivElement,
  dl: HTMLDListElement,
  embed: HTMLEmbedElement,
  fieldset: HTMLFieldSetElement,
  form: HTMLFormElement,
  head: HTMLHeadElement,
  hr: HTMLHRElement,
  html: HTMLHtmlElement,
  iframe: HTMLIFrameElement,
  img: HTMLImageElement,
  input: HTMLInputElement,
  ins: HTMLModElement,
  label: HTMLLabelElement,
  legend: HTMLLegendElement,
  link: HTMLLinkElement,
  map: HTMLMapElement,
  meta: HTMLMetaElement,
  meter: HTMLMeterElement,
  object: HTMLObjectElement,
  ol: HTMLOListElement,
  optgroup: HTMLOptGroupElement,
  option: HTMLOptionElement,
  p: HTMLParagraphElement,
  param: HTMLParamElement,
  picture: HTMLPictureElement,
  pre: HTMLPreElement,
  progress: HTMLProgressElement,
  q: HTMLQuoteElement,
  script: HTMLScriptElement,
  select: HTMLSelectElement,
  source: HTMLSourceElement,
  span: HTMLSpanElement,
  style: HTMLStyleElement,
  textarea: HTMLTextAreaElement,
  time: HTMLTimeElement,
  title: HTMLTitleElement,
  track: HTMLTrackElement,
  video: HTMLVideoElement,
  table: HTMLTableElement,
  caption: HTMLTableCaptionElement,
  tr: HTMLTableRowElement,
  template: HTMLTemplateElement,
  ul: HTMLUListElement
|};

// A generic tagged template literal definition
// - I is the interpolations' type
// - R is the return type
type TaggedTemplate<I, R> = (strings: string[], ...interpolations: I[]) => R;

type StyledInherentProps = {
  as?: ComponentType<*> | $Keys<HTMLIntrinsicElements>
};

// Props for a StyledComponent that takes the `theme`
// prop into account
type StyledProps<P, T = any> = P & {
  ...StyledInherentProps,
  theme: T
};

type StyleObject = {
  [x: string]: string | number | StyleObject
};

// All possible interpolation values, except functions
type InterpolationValue = void | null | false | string | number | StyleObject;

// An interpolation that appears inside the tagged template
// e.g. `${p => /*...*/} ${'example'}`
type Interpolation<P> =
  | InterpolationValue
  | Array<Interpolation<P>>
  | FlatInterpolation<P>
  | ((props: P) => Interpolation<P>);

// Return type for css`` tagged template method
type FlatInterpolation<P> =
  | InterpolationValue
  | ((props: P) => Interpolation<P>);

// Input object for withConfig
type StyledConfig = {
  displayName?: string,
  componentId?: string
};

type StyledComponentType<P, E = mixed> = AbstractComponent<P, E>;

// Higher order component to receive theme as prop
type WithThemeHoc<P, T = any> = (
  Comp: ComponentType<P>
) => ComponentType<StyledProps<P, T>>;

type AttrsFn<P = HTMLProps, T = mixed, E = mixed> = (
  attrs: (props: StyledProps<P, T>) => $Shape<P>
) => ThemedStyledFunction<P, T, E>;

// Specific styled function with a theme type
// fn`...${p => p.theme}`
type ThemedStyledFunction<P, T, E = mixed> = {
  (
    strs: string[],
    ...interpolations: Array<Interpolation<StyledProps<P, T>>>
  ): StyledComponentType<P, E>,
  attrs: (
    fn: (props: StyledProps<P, T>) => $Shape<P>
  ) => ThemedStyledFunction<P, T, E>
};

// General styled function w/o a theme type
// fn`...${p => p.someProps}`
type StyledFunction<P, E> = ThemedStyledFunction<P, mixed, E>;

// Specific css function typings with a theme type
type ThemedCssFunction<P = *, T = *> = TaggedTemplate<
  Interpolation<StyledProps<P, T>>,
  FlatInterpolation<StyledProps<P, T>>
>;

// General css function w/o a theme type
type CssFunction<P> = ThemedCssFunction<P, any>;

// keyframes utility
type KeyframesFunction = TaggedTemplate<InterpolationValue, string>;

// injectGlobal utility
type InjectGlobalFunction = TaggedTemplate<InterpolationValue, void>;

// ThemeProvider component
type ThemeProviderProps<T> = {
  children: Node,
  theme: T | (<K: T>(outer: K) => T)
};

type ThemeProvider<T> = ComponentType<ThemeProviderProps<T>, void>;
type ThemeContext<T> = Context<T>;
type ThemeConsumer<T> = $ElementType<ThemeContext<T>, 'Consumer'>;

// This is SC's "private" StyleSheet
class StyledStyleSheet {
  master: StyledStyleSheet;
  instance: StyledStyleSheet;
  id: number;
  sealed: boolean;
  forceServer: boolean;
  target: ?HTMLElement;
  capacity: number;
  clones: StyledStyleSheet[];

  rehydrate: () => StyledStyleSheet;
  reset: (forceServer?: boolean) => void;
  clone: () => StyledStyleSheet;
  sealAllTags: () => void;
  toHTML: () => string;
  toReactElements: () => Node[];
}

// ServerStyleSheet is a public stylesheet abstraction
class ServerStyleSheet {
  masterSheet: StyledStyleSheet;
  instance: StyledStyleSheet;

  collectStyles: (children: Node) => Node;
  getStyleTags: () => string;
  getStyleElement: () => Node[];
  // TODO: Proper types for ReadableStream
  interleaveWithNodeStream: <T>(readableStream: T) => T;
}

// A component providing a StyleSheet via context
type StyleSheetManager = ComponentType<{
  children: Node,
  sheet?: StyledStyleSheet | ServerStyleSheet,
  target?: HTMLElement
}>;

type HTMLProps = {
  children?: Node,
  [prop: string]: any
};

/* This maps HTMLIntrinsicElements (./dom-elements.js) to StyledTagComponents */
type IntrinsicElementToStyledTag = <V>(
  V
) => ThemedStyledFunction<HTMLProps, *, V>;
type IntrinsicStyledTags = $ObjMap<
  HTMLIntrinsicElements,
  IntrinsicElementToStyledTag
>;

// A styled() call returning the tagged template function with theme
type ThemedStyledCall<P = *, T = mixed, E = mixed> = {
  ...IntrinsicStyledTags,
  (
    x: $Keys<HTMLIntrinsicElements>
  ): ThemedStyledFunction<HTMLProps, T, HTMLElement>,
  (x: AbstractComponent<P, E>): ThemedStyledFunction<P, T, E>
};

// Useful for reexporting styled-components with a theme
type ThemedStyledComponents<T> = {
  css: CssFunction<*, T>,
  keyframes: KeyframesFunction,
  injectGlobal: InjectGlobalFunction,
  withTheme: WithThemeHoc<*, T>,
  ThemeProvider: ThemeProvider<T>,
  default: ThemedStyledCall<*, T, *>
};

declare module 'styled-components' {
  declare export type ThemedStyledComponents<T> = ThemedStyledComponents<T>;

  declare export type StyledComponent<P, E = mixed> = StyledComponentType<P, E>;
  declare export type ThemeProviderProps<T> = ThemeProviderProps<T>;
  declare export type ThemedStyledFunction<
    P,
    T,
    E = mixed
  > = ThemedStyledFunction<P, T, E>;
  declare export type StyledFunction<P> = StyledFunction<P>;
  declare export type ThemedCssFunction<P, T> = ThemedCssFunction<P, T>;
  declare export type CssFunction<P> = CssFunction<P>;
  declare export type ThemedStyledCall<P, T, E> = ThemedStyledCall<P, T, E>;
  declare export type StyledCall<P> = StyledCall<P>;
  declare export type IntrinsicStyledTags = IntrinsicStyledTags;

  declare export var css: CssFunction<*>;
  declare export var keyframes: KeyframesFunction;
  declare export var injectGlobal: InjectGlobalFunction;
  declare export var withTheme: WithThemeHoc<*>;
  declare export var ServerStyleSheet: ServerStyleSheet;
  declare export var StyleSheetManager: StyleSheetManager;

  declare export var ThemeProvider: ThemeProvider;
  declare export var ThemeContext: ThemeContext;
  declare export var ThemeConsumer: ThemeConsumer;

  declare export default ThemedStyledCall<*, *, *>;
}
