
// TODO: test
// TODO: docs
export function camelCase (str: string): string {
  return str.replace(/-\D/g, function (m: string): string {
    return m.charAt(1).toUpperCase();
  });
}


// TODO: test
// TODO: docs
export function hyphenate (str: string): string {
  return str.replace(/[A-Z]/g, function (m: string): string {
    return `-${m.toLowerCase()}`;
  });
}


// TODO: test
// TODO: docs
// ref. https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
export function uuidv4 (): string {
  if(window.crypto) {
    return ((1e7).toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (k: string) => {
      const c = parseInt(k, 10);
      return (c ^ window.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
    });
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c): string {
    const r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
