
// TODO: test
// TODO: docs
export function loadScript (url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const node = document.createElement("script");
    node.addEventListener("load", () => {
      resolve(url);
    });
    node.addEventListener("error", () => {
      const error = new URIError(`The script "${url}" didn't load correctly.`);
      reject(error);
    });
    node.setAttribute("type", "text/javascrpt");
    node.setAttribute("async", "true");
    node.setAttribute("src", url);
    document.head.appendChild(node);
  });
}
