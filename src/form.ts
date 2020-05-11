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
