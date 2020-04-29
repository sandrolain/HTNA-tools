import { forEach } from "./iterable";
import { getDescendantProp } from "./object";

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
export function at (selector: string | HTMLElement, eventName: string, listener: EventListenerOrEventListenerObject): boolean {
  const node = (typeof selector === "string") ? $(selector) : selector;
  if(node) {
    node.addEventListener(eventName, listener);
    return true;
  }
  return false;
}


// TODO: test
// TODO: docs
export function tpl (tokens: string[], ...values: any[]): HTMLTemplateBuilder {
  return new HTMLTemplateBuilder(tokens, values);
}

class HTMLTemplateBuilder {
  constructor (private tokens: string[], private values: any[]) {}

  template (vars = {}): HTMLTemplateElement {
    const html = this.html(vars);
    const node = document.createElement("template");
    node.innerHTML = html;
    return node;
  }

  html (vars: Record<string | number, any> = {}): string  {
    const html = [];
    const len = this.tokens.length;
    for(let i = 0; i < len; i++) {
      html.push(this.tokens[i]);
      const value = this.values[i];
      if(value !== null && value !== undefined) {
        const type: string = typeof value;
        let result;
        if(type === "function") {
          result = value(vars);
        } else if(type === "number") {
          result = vars[value];
        } else if(type === "string") {
          result = getDescendantProp(vars, value);
        }
        if(result !== null && result !== undefined) {
          html.push(result);
        }
      }
      return html.join("");
    }
  }
}

// TODO: test
// TODO: docs
export const byTagName = ($node: Element, tagName: string): Element[] => {
  return Array.from($node.getElementsByTagName(tagName));
};

// TODO: test
// TODO: docs
export const removeNode = ($node: Node): void => {
  if($node.parentNode) {
    $node.parentNode.removeChild($node);
  }
};

// TODO: test
// TODO: docs
export const removeNodes = ($$nodes: Node[]): void => {
  for(const $node of $$nodes) {
    removeNode($node);
  }
};

// TODO: test
// TODO: docs
export const insertNodeBefore = ($node: Node, $dest: Node): void => {
  if($dest.parentNode) {
    $dest.parentNode.insertBefore($node, $dest);
  }
};

// TODO: test
// TODO: docs
export const insertNodesBefore = ($$nodes: Node[], $dest: Node): void => {
  for(const $node of $$nodes) {
    insertNodeBefore($node, $dest);
  }
};

// TODO: test
// TODO: docs
export const replaceWithNode = ($dest: Node, $node: Node): void => {
  insertNodeBefore($node, $dest);
  removeNode($dest);
};

// TODO: test
// TODO: docs
export const replaceWithNodes = ($dest: Node, $$nodes: Node[]): void => {
  insertNodesBefore($$nodes, $dest);
  removeNode($dest);
};

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
