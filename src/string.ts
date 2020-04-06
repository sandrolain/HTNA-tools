
/**
 * Escape HTML entities
 * @param string The string to escape
 * @returns The escaped HTML string
 */
export function htmlEntities (string: string): string {
  return string.replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


// TODO: docs
export function camelCase (str: string): string {
  return str.replace(/-\D/g, function (m: string): string {
    return m.charAt(1).toUpperCase();
  });
}


// TODO: docs
export function hyphenate (str: string): string {
  return str.replace(/[A-Z]/g, function (m: string): string {
    return `-${m.toLowerCase()}`;
  });
}
