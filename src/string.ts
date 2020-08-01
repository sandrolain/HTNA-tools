
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


// TODO: test
// TODO: docs
export function compareVersionStrings (versionA: string, versionB: string): number {
  const partsVersionA = versionA.split(".");
  const partsVersionB = versionB.split(".");
  const maxLength     = Math.max(partsVersionA.length, partsVersionB.length);

  for(let i = 0; i < maxLength; i++) {
    if(!(i in partsVersionA) && partsVersionB[i] !== "0") {
      return -1;
    }

    if(!(i in partsVersionB) && partsVersionA[i] !== "0") {
      return 1;
    }

    let valueA = parseInt(partsVersionA[i] || "0", 10);
    let valueB = parseInt(partsVersionB[i] || "0", 10);

    if(isNaN(valueA)) {
      valueA = 0;
    }

    if(isNaN(valueB)) {
      valueB = 0;
    }

    if(valueA !== valueB) {
      return valueA - valueB;
    }
  }

  return 0;
}
