// TODO: docs
// TODO: test
export function getFormData (form: HTMLFormElement): FormData {
  return new FormData(form);
}

// TODO: docs
// TODO: test
export function getFormURLParams (form: HTMLFormElement): URLSearchParams {
  const entries = Array.from(getFormData(form).entries()).filter((value) => (typeof value === "string"));
  return new URLSearchParams(entries as string[][]);
}

// TODO: docs
// TODO: test
export function getFormObject (form: HTMLFormElement): Record<string, FormDataEntryValue> {
  return Object.fromEntries(getFormData(form).entries());
}

// TODO: docs
// TODO: test
export function setFormData (form: HTMLFormElement, data: FormData): void {
  for(const input of form.elements) {
    const inputA: any = input as any;
    if(data.has(inputA.name)) {
      const val = data.get(inputA.val);
      switch(inputA.type) {
      case "checkbox": inputA.checked = !!val; break;
      default:         inputA.value   = val;   break;
      }
    }
  }
}


export type GetValueResult = string | boolean | null | string[] | File | File[];

// TODO: docs
// TODO: test
export function getValue (node: HTMLElement): GetValueResult {
  if(node instanceof HTMLSelectElement) {
    if(node.multiple) {
      const options = node.options;
      const values = [];
      for(let i = 0, len = options.length; i < len; i++) {
        const option = options[i];
        if(option.selected) {
          values.push(option.value || option.text);
        }
      }
      return values;
    }
    return node.value;
  }

  if(node instanceof HTMLInputElement) {
    if(node.type === "file") {
      return node.multiple ? Array.from(node.files) : node.files[0];
    }

    if(node.type === "checkbox" || node.type === "radio") {
      return this.checked ? this.value : null;
    }

    return node.value;
  }

  return (node as HTMLTextAreaElement).value;
}

// TODO: docs
// TODO: test
export function setValue (node: HTMLElement, value: GetValueResult): void {
  if(node instanceof HTMLInputElement) {
    if(node.type === "checkbox" || node.type === "radio") {
      if(typeof value === "boolean") {
        node.checked = value;
      } else {
        node.checked = [].concat(value).includes(node.value);
      }
    } else {
      node.value = value.toString();
    }
  } else if(node instanceof HTMLSelectElement) {
    value = [].concat(value).map((item) => {
      return item.toString();
    }) as string[];
    for(const option of node.options) {
      option.selected = (value.indexOf(option.value) > -1 || value.indexOf(option.text) > -1);
    }
  } else {
    (node as HTMLTextAreaElement).value = value.toString();
  }
}

// TODO: docs
// TODO: test
export function getFormValues (node: HTMLElement): [string, GetValueResult][] {
  const data: [string, GetValueResult][] = [];
  const inputs = node.querySelectorAll<HTMLElement>("*[name]");
  for(const input of inputs) {
    const name = input.getAttribute("name");
    const value = getValue(input);
    data.push([ name, value ]);
  }
  return data;
}


export type ElementWithValidity = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

// TODO: docs
// TODO: test
export function addCustomValidityChecker (node: ElementWithValidity, checker: (input: ElementWithValidity) => string): () => void {
  const listener = (): void => {
    const customValidity = checker(node);
    node.setCustomValidity(customValidity || "");
  };
  node.addEventListener("input", listener);
  return (): void => {
    node.removeEventListener("input", listener);
  };
}
