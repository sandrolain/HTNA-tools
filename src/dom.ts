import { forEach } from "./iterable";

export type ElementAttributesMap = Map<string, any> | Record<string, any>;
export type ElementChildrenArray = (Node | string | number | ElementParamsArray)[];
export type ElementParamsArray   = [string, ElementAttributesMap?, ElementChildrenArray?, ElementCreationOptions?];

/**
 * Create a new HTMLElement DOM Node with specified attributes
 * ```typescript
 * // Create a plain HTMLDivElement DOM node
 * const divNode = element("div");
 * ```
 * <br/>
 *
 * ```typescript
 * // Create a HTMLDivElement DOM node with attributes and children
 * const divStyledNode = create("div", {
 *   style: "border: 1px solid #FF0000; padding: 1em",
 *   title: "My new div element"
 * }, [
 *   "Simple text and",
 *   element("br"),
 *   element("strong", null, ["Bold text"])
 * ]);
 * ```
 *
 * Result:<br/>
 * <div style="border: 1px solid #FF0000; padding: 1em" title="My new div element">Simple text and<br/><strong>Bold text</strong></div>
 * <br/>
 *
 * @param tagName The tag name of the element
 * @param attributes A Map with pairs name-value of the attributes to set to the element. Function values will be added as listeners
 * @param children An Array of DOM Node or string to be appended as Element's children
 * @param options
 * @param targetDocument
 * @returns The new DOM HTMLElement node for the specified tag name
 */
export function createElement<T=HTMLElement> (
  tagName: string,
  attributes?: ElementAttributesMap,
  children?: ElementChildrenArray,
  options?: ElementCreationOptions,
  targetDocument: Document = document
): T {
  const node = targetDocument.createElement(tagName, options);
  if(attributes) {
    forEach(attributes, (value, name) => {
      if(typeof value === "function") {
        node.addEventListener(name, value);
      } else {
        node.setAttribute(name, String(value));
      }
    });
  }
  if(children) {
    for(let child of children) {
      if(["string", "number"].includes(typeof child)) {
        child = document.createTextNode(child.toString());
        node.appendChild(child);
      } else if(child instanceof Node) {
        node.appendChild(child);
      } else if(Array.isArray(child)) {
        child = createElement(child[0], child[1], child[2], child[3], targetDocument) as HTMLElement;
        node.appendChild(child);
      }
    }
  }
  return node as unknown as T;
}

// TODO: test
// TODO: docs
export function $<T=HTMLElement> (selector: string, targetElement: Document | HTMLElement = document): T {
  return targetElement.querySelector(selector) as unknown as T;
}

// TODO: test
// TODO: docs
export function $$<T=HTMLElement> (selector: string, targetElement: Document | HTMLElement = document): T[] {
  return Array.from(targetElement.querySelectorAll(selector)) as unknown as T[];
}


// TODO: test
// TODO: docs
export class EventListenerSubscription {
  constructor (
    private node: Window | Document | Element,
    private eventName: string,
    private listener: EventListenerOrEventListenerObject,
    private options: boolean | AddEventListenerOptions
  ) {
    node.addEventListener(eventName, listener, options);
  }

  unsubscribe (): void {
    this.node.removeEventListener(this.eventName, this.listener, this.options);
  }
}


// TODO: test
// TODO: docs
export function addEventListener (selector: string | Window | Document | Element, eventName: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): EventListenerSubscription | false {
  const node = (typeof selector === "string") ? $(selector) : selector;
  return node ? new EventListenerSubscription(node, eventName, listener, options) : false;
}


// TODO: test
// TODO: docs
export function getDelegatedListener (delegatedSelector: string, listener: (event: Event) => void): EventListenerOrEventListenerObject {
  return (event: Event): void => {
    const eventTarget = event.target as HTMLElement;
    for(const targetItem of Array.from(document.querySelectorAll(delegatedSelector)).reverse()) {
      if(targetItem.contains(eventTarget)) {
        listener.call(targetItem, event);
      }
    }
  };
}


// TODO: test
// TODO: docs
export function delegateEventListener (node: string | Window | Document | Element, eventName: string, delegatedSelector: string, listener: (event: Event) => void, options?: AddEventListenerOptions): EventListenerSubscription | false {
  return addEventListener(node, eventName, getDelegatedListener(delegatedSelector, listener), options);
}


// TODO: test
// TODO: docs
export function byTagName (targetNode: Element, tagName: string): Element[] {
  return Array.from(targetNode.getElementsByTagName(tagName));
}

// TODO: test
// TODO: docs
export function createFragment (...nodes: Node[]): DocumentFragment {
  const fragment = document.createDocumentFragment();
  for(const node of nodes) {
    fragment.appendChild(node);
  }
  return fragment;
}

// TODO: test
// TODO: docs
export function append (targetNode: Element, ...nodes: Node[]): void {
  targetNode.appendChild(createFragment(...nodes));
}

// TODO: test
// TODO: docs
export function prepend (targetNode: Element, ...nodes: Node[]): void {
  const fragment = createFragment(...nodes);
  if(targetNode.firstChild) {
    targetNode.insertBefore(fragment, targetNode.firstChild);
  } else {
    targetNode.appendChild(fragment);
  }
}

// TODO: test
// TODO: docs
export function insertBefore (targetNode: Node, ...nodes: Node[]): void {
  targetNode.parentNode.insertBefore(createFragment(...nodes), targetNode);
}

// TODO: test
// TODO: docs
export function insertAfter (targetNode: Node, ...nodes: Node[]): void {
  const fragment = createFragment(...nodes);
  if(targetNode.nextSibling) {
    targetNode.parentNode.insertBefore(fragment, targetNode.nextSibling);
  } else {
    targetNode.parentNode.appendChild(fragment);
  }
}

// TODO: test
// TODO: docs
export function removeNode (targetNode: Node): void {
  targetNode.parentNode.removeChild(targetNode);
}

// TODO: test
// TODO: docs
export function removeChildren (targetNode: Element): void {
  targetNode.innerHTML = "";
}

// TODO: test
// TODO: docs
export function getNext (targetNode: Element): Element {
  let nextNode = targetNode.nextSibling;
  if(nextNode) {
    do {
      if(nextNode instanceof Element) {
        return nextNode;
      }
    } while((nextNode = nextNode.nextSibling));
  }
  return null;
}

// TODO: test
// TODO: docs
export function getPrevious (targetNode: Element): Element {
  let prevNode = targetNode.previousSibling;
  if(prevNode) {
    do {
      if(prevNode instanceof Element) {
        return prevNode;
      }
    } while((prevNode = prevNode.previousSibling));
  }
  return null;
}


// TODO: test
// TODO: docs
export function replaceNode (targetNode: Node, ...nodes: Node[]): void {
  insertBefore(targetNode, ...nodes);
  removeNode(targetNode);
}


// TODO: test
// TODO: docs
export const getAttributesMap = ($node: Element): Map<string, string> => {
  const attributes = new Map();

  for(let i = 0, len = $node.attributes.length; i < len; i++) {
    const { name, value } = $node.attributes.item(i);

    attributes.set(name, value);
  }

  return attributes;
};

// TODO: test
// TODO: docs
export const getAttributesObject = ($node: Element): Record<string, string> => {
  const attributes: Record<string, string> = {};

  for(let i = 0, len = $node.attributes.length; i < len; i++) {
    const { name, value } = $node.attributes.item(i);

    attributes[name] = value;
  }

  return attributes;
};

// TODO: test
// TODO: docs
export const getChildren = ($node: Element): Node[] => {
  return Array.from($node.childNodes);
};

// TODO: test
// TODO: docs
export function getTemplateNodeFromHTML (html: string): HTMLTemplateElement {
  const node = document.createElement("template");
  node.innerHTML = html;
  return node;
}

// TODO: test
// TODO: docs
export function getFragmentFromHTML (html: string): DocumentFragment {
  return getTemplateNodeFromHTML(html).content.cloneNode(true) as DocumentFragment;
}

// Sizes

// TODO: test
// TODO: docs
export function getElementRect (node: Element): DOMRect {
  return node.getBoundingClientRect();
}

// TODO: test
// TODO: docs
export function getPositionRespectTarget (node: Element, nodeX: number, nodeY: number, target: Element, targetX: number, targetY: number): { width: number; height: number; left: number; top: number; right: number; bottom: number } {
  const nodeRect   = node.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const left       = targetRect.left + (targetRect.width * targetX) - (nodeRect.width * nodeX);
  const top        = targetRect.top + (targetRect.height * targetY) - (nodeRect.height * nodeY);
  const right      = left + nodeRect.width;
  const bottom     = top + nodeRect.height;
  return { width: nodeRect.width, height: nodeRect.height, left, top, bottom, right };
}


// Focus

// TODO: test
// TODO: docs
export function getElementWithFocus (): Element {
  return document.activeElement;
}

// TODO: test
// TODO: docs
export function hasFocusWithin (node: Element): boolean {
  if(document.activeElement) {
    return (node === document.activeElement || node.contains(document.activeElement));
  }
  return false;
}


// Events

// TODO: test
// TODO: docs
export function onDocumentReady (callback: () => void): void {
  if(["complete", "loaded", "interactive"].includes(document.readyState)) {
    callback.call(document);
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}

// TODO: test
// TODO: docs
export function onDocumentLoad (callback: () => void): void {
  if(["complete"].includes(document.readyState)) {
    callback.call(document);
  } else {
    window.addEventListener("load", callback);
  }
}

// TODO: test
// TODO: docs
export function dispatchEvent (node: Element, name: string, detail?: any, bubbles: boolean = false): boolean {
  const event = new CustomEvent(name, {
    detail,
    bubbles,
    composed: true,
    cancelable: true
  });
  return node.dispatchEvent(event);
}


// Shadow DOM

// TODO: test
// TODO: docs
export function getShadow (target: Element, init: ShadowRootInit = { mode: "open", delegatesFocus: true }): ShadowRoot {
  return target.shadowRoot || target.attachShadow(init);
}

// TODO: test
// TODO: docs
export function setShadowHTML (target: Element, html: string): void {
  const shadow = getShadow(target);
  shadow.innerHTML = html;
}

// TODO: test
// TODO: docs
export function appendToShadow (target: Element, ...nodes: Node[]): void {
  const shadow = getShadow(target);
  const fragment = createFragment(...nodes);
  shadow.appendChild(fragment);
}


// requestAnimationFrame

export function debounceWithAnimationFrame (callback: () => any): () => void {
  let rafRequest: number = null;

  return function (): number {
    if(rafRequest) {
      window.cancelAnimationFrame(rafRequest);
    }
    rafRequest = window.requestAnimationFrame(function (...args) {
      rafRequest = null;
      callback.call(this, ...args);
    });
    return rafRequest;
  };
}


// Snippet

// TODO: test
// TODO: docs
export function createMetaViewport (options: {
  width?: number | string;
  initialScale?: number;
  userScalabe?: boolean;
  minimumScale?: number;
  maximumScale?: number;
} = {}): HTMLMetaElement {
  const {
    width = "device-width",
    initialScale = 1.0,
    userScalabe = true,
    minimumScale,
    maximumScale
  } = options;
  const meta = document.createElement("meta");
  const content = `width=${width}${!userScalabe ? ", user-scalable=no" : ""}, initial-scale=${initialScale}${minimumScale ? `, minimum-scale${minimumScale}` : ""}${maximumScale ? `, maximum-scale${maximumScale}` : ""}`;
  meta.setAttribute("name", "viewport");
  meta.setAttribute("content", content);
  return meta;
}

export function createStyle (content?: string): HTMLStyleElement {
  const style = document.createElement("style");
  style.setAttribute("type", "text/css");
  if(content) {
    style.appendChild(document.createTextNode(content));
  }
  return style;
}

export function createScript (options?: {
  type?: string;
  src?: string;
  async?: boolean;
  defer?: boolean;
}, content?: string): HTMLScriptElement {
  const {
    type = "module",
    src,
    async = false,
    defer = false
  } = options;
  const script = document.createElement("script");
  script.setAttribute("type", type);
  if(src) {
    script.setAttribute("src", src);
  }
  if(async) {
    script.setAttribute("async", "async");
  }
  if(defer) {
    script.setAttribute("defer", "defer");
  }
  if(content) {
    script.appendChild(document.createTextNode(content));
  }
  return script;
}
