import { forEach } from "./iterable";

export type ElementAttributesMap = Map<string, any> | Record<string, any>;
export type ElementChildrenArray = (Node | string | ElementParamsArray)[];
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
export function create<T=HTMLElement> (
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
        child = create(child[0], child[1], child[2], child[3], targetDocument) as HTMLElement;
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
export function on (selector: string | HTMLElement, eventName: string, listener: EventListenerOrEventListenerObject): boolean {
  const node = (typeof selector === "string") ? $(selector) : selector;
  if(node) {
    node.addEventListener(eventName, listener);
    return true;
  }
  return false;
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
