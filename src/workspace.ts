export interface Workspace {
  id: string;
  data: Record<string, any>;
}

export type WorkspaceChangeListener = (info: WorkspaceChange) => any;

export interface WorkspaceChange {
  index: number;
  workspace: Workspace;
}

export class WorkspaceManager {
  private workspaces: Workspace[] = [];
  private activeIndex: number = 0;
  private changeListeners: WorkspaceChangeListener[] = [];

  constructor () {
    //
  }

  addWorkspace (space: Workspace): void {
    this.workspaces.push(space);
  }

  setWorkspace (index: number, space: Workspace): void {
    this.workspaces[index] = space;
  }

  getWorkspace (index: number): Workspace {
    return this.workspaces[index] || null;
  }

  getWorkspaceById (id: string): Workspace {
    for(const space of this.workspaces) {
      if(space.id === id) {
        return space;
      }
    }
    return null;
  }

  removeWorkspace (space: Workspace): boolean {
    return this.removeWorkspaceByIndex(this.workspaces.indexOf(space));
  }

  removeWorkspaceByIndex (index: number): boolean {
    if(index > -1 && index < (this.workspaces.length - 1)) {
      this.workspaces.splice(index, 1);
      return true;
    }
    return false;
  }

  setActiveWorkspace (index: number): void {
    if(index > -1 && index < (this.workspaces.length - 1)) {
      this.activeIndex = index;
      this.triggerChange();
    }
  }

  getActiveWorkspace (): WorkspaceChange {
    return {
      index: this.activeIndex,
      workspace: this.workspaces[this.activeIndex]
    };
  }

  onChange (fn: WorkspaceChangeListener): void {
    this.changeListeners.push(fn);
  }

  private triggerChange (): void {
    const changeInfo: WorkspaceChange = this.getActiveWorkspace();
    for(const fn of this.changeListeners) {
      fn(changeInfo);
    }
  }
}
