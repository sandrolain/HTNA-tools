import { hyphenate } from "./string";
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
export function getPropertiesString (rules: Record<string, any>): string {
  const temp: string[] = [];
  for(const prop in rules) {
    temp.push(processPropertyValueAsString(prop, rules[prop]));
  }
  return temp.join("\n");
}

// TODO: docs
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
export function formatStyleImport (url: string): string {
  return `@import url('${url}');`;
}
