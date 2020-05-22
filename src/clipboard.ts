
// TODO: test
// TODO: docs
// TODO: string or dom ?
export function copyToClipboard (str: string): boolean {
  const el = document.createElement("textarea");
  el.style.position = "absolute";
  el.style.left = "0";
  el.style.top = "0";
  el.style.opacity = "0";
  el.value = str;
  document.body.appendChild(el);
  el.focus();
  el.select();
  const result = document.execCommand("copy");
  document.body.removeChild(el);
  return result;
}
