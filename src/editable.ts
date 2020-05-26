export interface EditableOptions {
  paragraphSeparator?: "string";
  styleWithCSS?: "true" | "false";
}

export class Editable {
  constructor (private node: HTMLElement, options: EditableOptions = {}) {
    if(options.paragraphSeparator) {
      this.command("defaultParagraphSeparator", options.paragraphSeparator);
    }
    if(options.styleWithCSS) {
      this.command("styleWithCSS", options.styleWithCSS);
    }
  }

  enableEditing (): void {
    this.node.setAttribute("contenteditable", "true");
  }

  disableEditing (): void {
    this.node.setAttribute("contenteditable", "false");
  }

  private command (cmd: string, value?: string): boolean {
    return document.execCommand(cmd, false, value);
  }

  formatBlock (tag: string): boolean {
    return this.command("formatblock", tag);
  }

  setFontFamily (font: string): boolean {
    return this.command("fontname", font);
  }

  setFontSize (size: string): boolean {
    return this.command("fontsize", size);
  }

  decreaseFontSize (): boolean {
    return this.command("decreaseFontSize");
  }

  increaseFontSize (): boolean {
    return this.command("increaseFontSize");
  }

  insertHorizontalRule (): boolean {
    return this.command("insertHorizontalRule");
  }

  insertHTML (html: string): boolean {
    return this.command("insertHTML", html);
  }

  insertText (text: string): boolean {
    return this.command("insertText", text);
  }

  setColor (color: string): boolean {
    return this.command("forecolor", color);
  }

  setBackgroundColor (color: string): boolean {
    return this.command("backcolor", color);
  }

  removeFormat (): boolean {
    return this.command("removeFormat");
  }

  delete (): boolean {
    return this.command("delete");
  }

  bold (): boolean {
    return this.command("bold");
  }

  italic (): boolean {
    return this.command("italic");
  }

  underline (): boolean {
    return this.command("underline");
  }

  strikeThrough (): boolean {
    return this.command("strikeThrough");
  }

  subscript (): boolean {
    return this.command("subscript");
  }

  superscript (): boolean {
    return this.command("superscript");
  }

  justifyLeft (): boolean {
    return this.command("justifyleft");
  }

  justifyCenter (): boolean {
    return this.command("justifycenter");
  }

  justifyRight (): boolean {
    return this.command("justifyright");
  }

  justifyFull (): boolean {
    return this.command("justifyFull");
  }

  orderedList (): boolean {
    return this.command("insertorderedlist");
  }

  unorderedList (): boolean {
    return this.command("insertunorderedlist");
  }

  insertLink (url: string): boolean {
    return this.command("createLink", url);
  }

  removeLink (url: string): boolean {
    return this.command("unlink", url);
  }

  insertImage (url: string): boolean {
    return this.command("insertImage", url);
  }

  addIntentation (): boolean {
    return this.command("indent");
  }

  removeIntentation (): boolean {
    return this.command("outdent");
  }

  undo (): boolean {
    return this.command("undo");
  }

  redo (): boolean {
    return this.command("redo");
  }

  cut (): boolean {
    return this.command("cut");
  }

  copy (): boolean {
    return this.command("copy");
  }

  paste (): boolean {
    return this.command("paste");
  }

  selectAll (): boolean {
    return this.command("selectAll");
  }
}
