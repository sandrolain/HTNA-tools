
export interface DraggableConfig {
  itemsSelector: string;
  handleSelector?: string;
  containerSelector: string;
}

export class Draggable {
  private draggingElement: HTMLElement;
  private otherItems: HTMLElement[] = [];

  constructor (private config: DraggableConfig) {
    const containers = this.getContainerElements();

    for(const container of containers) {
      container.addEventListener("dragover", (event) => {
        if(this.draggingElement) {
          const target = event.target as HTMLElement;
          if(this.otherItems.includes(target)) {
            const result = this.getWhitinElement(this.otherItems, event.clientX, event.clientY);
            if(result) {
              if(result.position === "before") {
                if(this.draggingElement.nextSibling !== result.element) {
                  result.element.parentElement.insertBefore(this.draggingElement, result.element);
                }
              } else {
                const nextElement = result.element.nextSibling;
                if(nextElement) {
                  if(this.draggingElement.nextSibling !== nextElement) {
                    result.element.parentElement.insertBefore(this.draggingElement, nextElement);
                  }
                } else {
                  result.element.parentElement.appendChild(this.draggingElement);
                }
              }
            }
          }
        }
        event.preventDefault();
      });

      let lastEnterTarget: HTMLElement;

      container.addEventListener("dragenter", (event) => {
        lastEnterTarget = event.target as HTMLElement;
        if(event.target === container) {
          container.classList.add("draggable-inside");
        }
      });

      container.addEventListener("dragleave", (event) => {
        if(event.target === lastEnterTarget) {
          container.classList.remove("draggable-inside");
        }
      });

      container.addEventListener("pointerdown", (event) => {
        const target = event.target as HTMLElement;
        const handles = this.getElements(`${this.config.itemsSelector} ${this.config.handleSelector}`, container);
        let item: HTMLElement = null;
        for(const handle of handles) {
          if(target === handle || handle.contains(target)) {
            item = handle.closest(this.config.itemsSelector);
            break;
          }
        }
        this.draggingElement = item;
        if(item) {
          item.classList.add("draggable-dragging");
          if(!item.draggable) {
            item.draggable = true;
          }
        }
      });

      container.addEventListener("dragstart", (event) => {
        event.stopPropagation();
        if(this.draggingElement) {
          this.otherItems = this.getAllItems(this.draggingElement);
        }
      });

      container.addEventListener("drop", () => {
        container.classList.remove("draggable-inside");
      });
    }

    document.addEventListener("dragend", () => {
      if(this.draggingElement) {
        this.draggingElement.draggable = false;
        this.draggingElement.classList.remove("draggable-dragging");
        this.draggingElement = null;
      }
    });
  }

  private getElements (selector: string, parent: HTMLElement | Document = document): HTMLElement[] {
    return Array.from(parent.querySelectorAll(selector));
  }

  private getContainerElements (): HTMLElement[] {
    return this.getElements(this.config.containerSelector);
  }

  private getItemsElementForContainer (conainter: HTMLElement): HTMLElement[] {
    return this.getElements(this.config.itemsSelector, conainter);
  }

  private getAllItems (exclude: HTMLElement): HTMLElement[] {
    const containers = this.getContainerElements();
    const items = containers.map((container) => this.getItemsElementForContainer(container)).flat();
    const index = items.indexOf(exclude);
    if(index > -1) {
      items.splice(index, 1);
    }
    return items;
  }

  private getWhitinElement (elements: HTMLElement[], x: number, y: number): { element: HTMLElement; position: "before" | "after"} {
    for(const element of elements) {
      const rect = element.getBoundingClientRect();
      if(x >= rect.left && y >= rect.top && x <= rect.right && y <= rect.bottom) {
        let position: "before" | "after" = "before";
        if(y > rect.top + (rect.height / 2)) {
          position = "after";
        }
        return {
          element,
          position
        };
      }
    }
  }
}
