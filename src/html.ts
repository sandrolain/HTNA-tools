
/**
 * Escape HTML entities
 * @param string The string to escape
 * @returns The escaped HTML string
 */
export function htmlEntities (value: string): string {
  return value.replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// TODO: docs
// TODO: test
export function htmlEntitiesDecode (value: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}
