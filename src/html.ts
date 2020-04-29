
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
