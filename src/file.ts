import { formatNumber } from "./number";

// TODO: docs
// TODO: test
export function formatFilesize (size: number, precision: number = 2, decSep: string = ",", sectSep: string = "."): string {
  const sizesUnits = ["Byte", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const unitsNum = sizesUnits.length;
  let i = 0;
  for(; i < 9 && unitsNum >= 1024; i++) {
    size /= 1024;
  }
  const formatted = formatNumber(size, precision, decSep, 3, sectSep);
  return `${formatted} ${sizesUnits[i]}`;
}

// TODO: docs
// TODO: test
export function downloadBlob (blob: Blob, fileName: string = "download"): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
}

// TODO: docs
// TODO: test
export function getBlobFromDataURI (dataURI: string): Promise<Blob> {
  return fetch(dataURI).then(res => res.blob());
}

// TODO: docs
// TODO: test
export function getDataURIFromBase64 (base64: string, type: string = "application/octet-stream"): string {
  return `data:${type};base64,${base64}`;
}

// TODO: docs
// TODO: test
export function getBlobFromBase64 (base64: string, type: string = "application/octet-stream"): Promise<Blob> {
  return fetch(getDataURIFromBase64(base64, type)).then(res => res.blob());
}

// TODO: docs
// TODO: test
export function getDataURIFromBlob (blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.addEventListener("load", () => {
      resolve(reader.result as string);
    });
    reader.addEventListener("error", (e) => {
      reject(e);
    });
  });
}

// TODO: docs
// TODO: test
export function getBase64FromBlob (blob: Blob): Promise<string> {
  return getDataURIFromBlob(blob).then((dataURI) => dataURI.split(",")[1]);
}

// TODO: docs
// TODO: test
export function requestFile (options: {multiple?: boolean; accept?: string; maxSize?: number; max?: number} = {}): Promise<File[]> {
  return new Promise(function (resolve) {
    const input = document.createElement("input");
    input.type = "file";
    input.style.position = "absolute";
    input.style.left = "-9999px";
    input.style.top = "-9999px";
    input.style.width = "1px";
    input.style.height = "1px";
    input.style.opacity = "0";
    input.style.pointerEvents = "none";

    if(options.multiple) {
      input.multiple = true;
    }

    if(options.accept) {
      input.accept = options.accept;
    }

    document.body.appendChild(input);

    let resolved = false;

    input.addEventListener("change", function () {
      let files = Array.from(this.files);

      if(options.maxSize) {
        files = files.filter((file) => (file.size <= options.maxSize));
      }

      if(options.max && files.length > options.max) {
        files = files.slice(0, options.max);
      }

      input.parentNode.removeChild(input);
      resolved = true;
      resolve(files);
    });

    input.addEventListener("blur", function () {
      if(!resolved) {
        resolved = true;
        resolve([]);
      }
    });

    input.focus();
    input.click();
  });
}
