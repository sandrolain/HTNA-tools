import { hyphenate, camelCase } from "./string";
import { fetchText } from "./netw";

const numberOnlyProperties: Record<string, boolean> = {
  "z-index": true,
  "font-weight": true,
  "opacity": true,
  "zoom": true
};

const multiValuesProperties: Record<string, boolean> = {
  "margin": true,
  "padding": true,
  "border-radius": true
};

export type ProcessPropertyValueResult = {property: string; value: string; priority: string};
export type ProcessPropertyValuePriority = "" | "!important";
export interface StyleStructure {
  [key: string]: any;
}


// TODO: docs
// TODO: test
export function processPropertyValue (property: string, value: any, priority: ProcessPropertyValuePriority = ""): ProcessPropertyValueResult {
  property = hyphenate(property);

  const valType = typeof value;

  if(valType === "number") {
    if(property.match(/color/i)) {
      value = `#${value.toString(16)}`;
    } else if(!numberOnlyProperties[property]) {
      value += "px";
    }
  } else {
    if(property === "background-image-url") {
      property  = "background-image";
      value    = `url(${value})`;
    }

    if(value instanceof Array) {
      // TODO: caso array [valore, unità] es [10, "em"]
      const list = [];

      for(const val of value) {
        const res = this.fixPropertyValue(property, val);

        list.push(res.value);
      }

      const sep = multiValuesProperties[property] ? " " : ", ";

      value = list.join(sep);
    }
  }

  value = `${value}`;

  return {
    property,
    value,
    priority
  };
}

// TODO: docs
// TODO: test
export function processPropertyValueAsString (property: string, value: any, pad = 0): string {
  const res = processPropertyValue(property, value);
  return `${"  ".repeat(pad)}${res.property}: ${res.value}${res.priority ? " " : ""}${res.priority};`;
}

// TODO: docs
// TODO: test
export function serializeStyleStructure (obj: Record<string, any>, parentKey: string = null, pad: number = 0): string {
  const res = [];
  const sub = [];

  for(const key in obj) {
    let val     = obj[key];
    let valType = typeof val;
    let subKey  = key;
    let mediaKey;

    if(key.match(/@media/i)) {
      mediaKey  = key;
      subKey    = null;
      pad      += 1;
    } else if(parentKey) {
      subKey = `${parentKey} ${key}`;
    }

    if(valType === "function") {
      val     = val();
      valType = typeof val;
    }

    if(mediaKey) {
      sub.push(`${mediaKey} {`);
    }

    if(valType !== "undefined" && val !== null) {
      if(valType === "object" && !(val instanceof Array)) {
        sub.push(serializeStyleStructure(val, subKey, pad));

        // TODO: caso Array?
      } else {
        res.push(processPropertyValueAsString(key, val, pad + 1));
      }
    }

    if(mediaKey) {
      sub.push("}");
    }
  }

  if(res.length > 0 && parentKey) {
    res.unshift(`${"  ".repeat(pad)}${parentKey} {`);
    res.push(`${"  ".repeat(pad)}}\n`);
  }

  return res.concat(sub).join("\n");
}

// TODO: docs
// TODO: test
export function getPropertiesAsString (rules: Record<string, any>): string {
  const temp: string[] = [];
  for(const prop in rules) {
    temp.push(processPropertyValueAsString(prop, rules[prop]));
  }
  return temp.join("\n");
}

// TODO: docs
// TODO: test
export function parsePropertiesString (rules: string): Record<string, any> {
  const res: Record<string, any> = {};
  for(const item of rules.split(";")) {
    const [name, value] = item.split(":");
    res[camelCase(name.trim())] = value.trim();
  }
  return res;
}

/**
 * Gets the contents of an external style sheet and resolves the imports by incorporating the source
 * @param url The url of the external style sheet
 * @param init *RequestInit* parameters for fetch requests
 */
export async function fetchStyleImports (url: string, init?: RequestInit): Promise<string> {
  let source = await fetchText(url, init);
  const importRegExp = /@import\s+(?:url\()?['"]?([^'"]+)['"]?\)?;?/gi;
  let match;
  while((match = importRegExp.exec(source))) {
    const importString = match[0];
    const importUrl    = new URL(match[1], url).href;
    const importSource = await fetchStyleImports(importUrl, init);
    source = source.replace(importString, importSource);
  }
  return source;
}

// TODO: docs
// TODO: test
export function formatStyleImport (url: string): string {
  return `@import url('${url}');`;
}

// TODO: docs
// TODO: test
export function setStyle (node: HTMLElement, style: Record<string, any> | string): void {
  if(typeof style === "string") {
    style = parsePropertiesString(style);
  }
  Object.assign(node.style, style);
}

// TODO: docs
// TODO: test
export function getStyle (node: HTMLElement, style: string | string[]): Record<string, string> {
  const res: Record<string, string> = {};
  const nodeStyle = node.style;
  style = [].concat(style);
  for(const name of style) {
    res[name] = nodeStyle.getPropertyValue(name);
  }
  return res;
}

// TODO: docs
// TODO: test
export function setStyleRollback (node: HTMLElement, style: Record<string, any>): () => Record<string, string> {
  const props = Object.keys(style);
  const oldStyle = getStyle(node, props);
  setStyle(node, style);
  return function (): Record<string, string> {
    setStyle(node, oldStyle);
    return oldStyle;
  };
}

// TODO: docs
// TODO: test
export function getStyleComputed (node: Element, style: string | string[]): Record<string, string> {
  const res: Record<string, string> = {};
  const nodeStyle = window.getComputedStyle(node);
  style = [].concat(style);
  for(const name of style) {
    res[name] = nodeStyle.getPropertyValue(name);
  }
  return res;
}

// TODO: docs
// TODO: test
export function getPseudoElementStyle (node: Element, pseudoElement: string, style: string | string[]): Record<string, string> {
  const res: Record<string, string> = {};
  const nodeStyle = window.getComputedStyle(node, pseudoElement);
  style = [].concat(style);
  for(const name of style) {
    res[name] = nodeStyle.getPropertyValue(name);
  }
  return res;
}

// TODO: docs
// TODO: test
export function animateTo (node: Element, style: (Keyframe | string)[] | PropertyIndexedKeyframes | string, options: KeyframeEffectOptions = {
  duration: 300,
  easing: "ease",
  iterations: 1,
  direction: "normal",
  fill: "forwards"
}, onFinish?: EventListenerOrEventListenerObject): Animation {
  style = [].concat(style);
  const styleArr: Keyframe[] = style.map((item) => {
    if(typeof item === "string") {
      return parsePropertiesString(item);
    }
    return item;
  });
  if(styleArr.length === 1) {
    const props      = Object.keys(styleArr[0]);
    const startStyle = getStyleComputed(node, props);
    styleArr.unshift(startStyle);
  }
  const animation = node.animate(styleArr, options);
  if(onFinish) {
    animation.addEventListener("finish", onFinish);
  }
  return animation;
}
