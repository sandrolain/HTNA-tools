export interface TableConfig<T=any> {
  page?: number;
  total?: number;
  perPage?: number;
  perPageOptions?: number[];
  selectable?: boolean;
  multiSorting?: boolean;
  sorting?: Record<string, "ASC" | "DESC">;
  dataFetcher?: (table: Table) => T[] | Promise<T[]>;
  showFilters?: boolean;
}

export type TableSortingMode = "ASC" | "DESC" | null;

export type TableSorting = Record<string, TableSortingMode>;

export interface TableRow<T=any> {
  data: T;
  checkbox?: HTMLInputElement;
  tr: HTMLTableRowElement;
}

export interface TableColumn<T=any> {
  key: string;
  visible: boolean;
  label?: string | Node;
  sortingModes?: TableSortingMode[] | false;
  filter?: HTMLElement;
  filterDelay?: number;
  renderValue?: (value: T, column: TableColumn) => Node;
  sortFunction?: (a: T, b: T, type: "ASC" | "DESC") => number;
}

export class Table<T=Record<string, any>> {
  private config: TableConfig<T> = {
    page: 1,
    total: 0,
    perPage: 10,
    perPageOptions: [10],
    selectable: false,
    multiSorting: false,
    sorting: {},
    dataFetcher: (): T[] => [],
    showFilters: false
  }

  private listeners: ((table: Table) => any | Promise<any>)[] = [];
  private columns: TableColumn[] = [];
  private filtersListeners: WeakMap<HTMLElement, (event: Event) => any> = new WeakMap();
  public dataset: T[] = [];

  private rows: Map<T, TableRow<T>> = new Map();
  private selected: Set<T> = new Set();
  private checkboxAll: HTMLInputElement;

  private $table: HTMLTableElement;
  private $thead: HTMLTableSectionElement;
  private $tbody: HTMLTableSectionElement;

  get page (): number {
    return this.config.page;
  }

  get perPage (): number {
    return this.config.perPage;
  }

  get sorting (): Record<string, "ASC" | "DESC"> {
    return { ...this.config.sorting };
  }

  get total (): number {
    return this.config.total;
  }

  get totalPages (): number {
    return Math.ceil(this.config.total / this.config.perPage);
  }

  get tableNode (): HTMLTableElement {
    return this.$table;
  }

  constructor (config: TableConfig<T> = {}) {
    this.$table = document.createElement("table");
    this.$thead = document.createElement("thead");
    this.$tbody = document.createElement("tbody");
    this.$table.appendChild(this.$thead);
    this.$table.appendChild(this.$tbody);

    this.setConfig(config);
  }

  setConfig (config: TableConfig): void {
    Object.assign(this.config, config);
    this.triggerDataFetcher();
  }

  getConfig (): TableConfig {
    return Object.assign({}, this.config);
  }

  setColumnSorting (key: string, sorting: TableSortingMode): void {
    if(sorting) {
      if(!this.config.multiSorting) {
        this.config.sorting = {};
      }
      this.config.sorting[key] = sorting;
    } else {
      delete this.config.sorting[key];
    }
    const ths = Array.from(this.$thead.querySelectorAll(`tr:first-of-type th[data-key="${key}"]`));
    for(const th of ths) {
      th.setAttribute("data-sorting", sorting || "");
    }
  }

  toggleColumnSorting (key: string): void {
    const actSorting = this.config.sorting[key] || null;
    const sortingModes = this.getColumSortingModes(key);
    if(sortingModes && sortingModes.length > 0) {
      const actSortingIndex = sortingModes.indexOf(actSorting);
      const nxtSortingIndex = (actSortingIndex + 1) % sortingModes.length;
      const nxtSorting = sortingModes[nxtSortingIndex] || null;
      this.setColumnSorting(key, nxtSorting);
    } else {
      this.setColumnSorting(key, null);
    }
  }

  private getColumSortingModes (key: string): false | TableSortingMode[] {
    for(const column of this.columns) {
      if(column.key === key) {
        return column.sortingModes;
      }
    }
    return false;
  }

  private initColumn (column: TableColumn<T>): TableColumn<T> {
    return Object.assign({
      visible: true,
      label: "",
      sortable: false,
      filter: null,
      filterDelay: 1000,
      renderValue: (value: T) => document.createTextNode(`${value}`),
      sortFunction: (a: T, b: T, type: "ASC" | "DESC") => {
        return (a === b ? 0 : (a < b ? -1 : 1)) * (type === "DESC" ? -1 : 1);
      }
    }, column);
  }

  public addColumn (column: TableColumn): void {
    this.columns.push(this.initColumn(column));
  }

  public addColumns (columns: TableColumn[]): void {
    this.columns = [...this.columns, ...(columns.map((column) => this.initColumn(column)))];
  }

  public setColumn (index: number, column: TableColumn): void {
    this.columns[index] = this.initColumn(column);
  }

  public setColumns (columns: TableColumn[]): void {
    this.columns = columns.slice(0).map((column) => this.initColumn(column));
  }

  public getColumn (index: number): TableColumn {
    return this.columns[index];
  }

  public getColumnByKey (key: string): TableColumn {
    for(const column of this.columns) {
      if(column.key === key) {
        return column;
      }
    }
    return null;
  }

  public getFilters (): Record<string, any> {
    const filters: Record<string, any> = {};
    for(const column of this.columns) {
      if(column.filter) {
        filters[column.key] = (column.filter as HTMLInputElement).value;
      }
    }
    return filters;
  }

  private renderHead (): void {
    this.$thead.innerHTML = "";
    const $f = document.createDocumentFragment();
    const showFilters = this.config.showFilters;
    const trLabels = document.createElement("tr");
    const trFilters = showFilters ? document.createElement("tr") : null;
    if(this.config.selectable) {
      const thCheckboxAll = document.createElement("th");
      this.checkboxAll = document.createElement("input");
      this.checkboxAll.type = "checkbox";
      this.checkboxAll.addEventListener("change", () => {
        if(this.checkboxAll.checked) {
          this.selectAll();
        } else {
          this.unselectAll();
        }
      });
      thCheckboxAll.appendChild(this.checkboxAll);
      trLabels.appendChild(thCheckboxAll);
      if(showFilters) {
        const thEmpty = document.createElement("th");
        trFilters.appendChild(thEmpty);
      }
    }
    for(const column of this.columns) {
      const [thLabel, thFilter] = this.renderColumnHead(column, showFilters);
      trLabels.appendChild(thLabel);
      if(showFilters) {
        trFilters.appendChild(thFilter);
      }
    }
    $f.appendChild(trLabels);
    if(showFilters) {
      $f.appendChild(trFilters);
    }
    this.$thead.appendChild($f);
  }

  private renderColumnHead (column: TableColumn, showFilters: boolean): [HTMLElement, HTMLElement] {
    const thLabel = document.createElement("th");
    thLabel.setAttribute("data-key", column.key);
    const label = column.label instanceof Node ? column.label : document.createTextNode(column.label);
    thLabel.appendChild(label);

    if(column.sortingModes && column.sortingModes.length > 0) {
      const mode = this.config.sorting[column.key] || "";
      thLabel.setAttribute("data-sorting", mode);
      thLabel.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.toggleColumnSorting(column.key);
        this.requestDataFetcher(0);
      });
    }

    let thFilter: HTMLTableHeaderCellElement = null;

    if(showFilters) {
      thFilter = document.createElement("th");
      thFilter.setAttribute("data-key", column.key);

      const filterInput = column.filter;

      if(filterInput) {

        const oldListener = this.filtersListeners.get(filterInput);
        if(oldListener) {
          filterInput.removeEventListener("change", oldListener);
        }

        const listener = (): void => {
          this.requestDataFetcher(column.filterDelay);
        };
        filterInput.addEventListener("change", listener);
        this.filtersListeners.set(filterInput, listener);

        thFilter.appendChild(filterInput);
      }
    }

    return [thLabel, thFilter];
  }

  private renderBody (): void {
    this.$tbody.innerHTML = "";
    this.selected = new Set(); ///
    this.rows = new Map();
    const $f = document.createDocumentFragment();
    for(const [index, item] of this.dataset.entries()) {
      const tr = document.createElement("tr");
      tr.setAttribute("data-index", index.toString());
      let checkbox: HTMLInputElement = null;
      if(this.config.selectable) {
        const td = document.createElement("td");
        checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", () => {
          if(checkbox.checked) {
            this.select(item);
          } else {
            this.unselect(item);
          }
        });
        td.appendChild(checkbox);
        tr.appendChild(td);
      }
      for(const column of this.columns) {
        const value = (item as any)[column.key];
        const td = this.renderColumnCell(value, column);
        tr.appendChild(td);
      }
      $f.appendChild(tr);

      this.$tbody.appendChild($f);
      this.rows.set(item, {
        data: item,
        tr,
        checkbox
      });
    }
  }

  private renderColumnCell (value: any, column: TableColumn): HTMLTableCellElement {
    const td = document.createElement("td");
    td.setAttribute("data-key", column.key);
    const valueNode = column.renderValue(value, column);
    td.appendChild(valueNode);
    return td;
  }

  private renderTable (): void {
    this.renderHead();
    this.renderBody();
  }

  private select (item: T): void {
    this.selected.add(item);
    const row = this.rows.get(item);
    if(row) {
      row.tr.classList.add("selected");
      if(row.checkbox) {
        row.checkbox.checked = true;
      }
    }
    this.verifyAllSelected();
  }

  private unselect (item: T): void {
    this.selected.delete(item);
    const row = this.rows.get(item);
    if(row) {
      row.tr.classList.remove("selected");
      if(row.checkbox) {
        row.checkbox.checked = false;
      }
    }
    this.verifyAllSelected();
  }

  private verifyAllSelected (): void {
    if(this.checkboxAll) {
      let allSelected = true;
      for(const row of this.rows.values()) {
        if(!row.checkbox || !row.checkbox.checked) {
          allSelected = false;
          break;
        }
      }
      this.checkboxAll.checked = (this.rows.size > 0 && allSelected);
    }
  }

  private selectAll (): void {
    for(const item of this.dataset) {
      this.selected.add(item);
      const row = this.rows.get(item);
      if(row) {
        row.tr.classList.add("selected");
        if(row.checkbox) {
          row.checkbox.checked = true;
        }
      }
    }
    if(this.checkboxAll) {
      this.checkboxAll.checked = true;
    }
  }

  private unselectAll (): void {
    this.selected = new Set();
    for(const row of this.rows.values()) {
      row.tr.classList.remove("selected");
      if(row.checkbox) {
        row.checkbox.checked = false;
      }
    }
    if(this.checkboxAll) {
      this.checkboxAll.checked = false;
    }
  }

  getSelected (): T[] {
    return Array.from(this.selected);
  }

  private dataFetcherTO: number;
  private requestDataFetcher (delay: number): void {
    if(this.dataFetcherTO) {
      window.clearTimeout(this.dataFetcherTO);
      this.dataFetcherTO = null;
    }
    this.dataFetcherTO = window.setTimeout(() => {
      this.triggerDataFetcher();
    }, delay);
  }

  async triggerDataFetcher (): Promise<void> {
    let data = this.config.dataFetcher(this);
    if(data instanceof Promise) {
      data = await data;
    }

    this.dataset = data;

    for(const listener of this.listeners) {
      try {
        const res = listener(this);
        if(res instanceof Promise) {
          await res;
        }
      } catch(e) {
        // e
      }
    }

    this.renderTable();
  }

  onData (listener: (table: Table) => any): void {
    this.listeners.push(listener);
  }
}


export class TableFSP<T=any> {

  constructor (private table: Table) {
  }

  private filterData (data: T[]): T[] {
    // TODO
    return data.slice(0);
  }

  private sortData (data: T[]): T[] {
    const config = this.table.getConfig();

    data.sort((a: T, b: T): number => {
      let sortResult: number = 0;
      for(const [key, sortType] of Object.entries(config.sorting)) {
        const column = this.table.getColumnByKey(key);
        if(column) {
          sortResult = column.sortFunction((a as any)[key], (b as any)[key], sortType);
          if(sortResult !== 0) {
            return sortResult;
          }
        }
      }
      return sortResult;
    });

    return data;
  }

  private paginateData (data: T[]): T[] {
    const config     = this.table.getConfig();
    const pageIndex  = Math.min(Math.max(config.page, 1), Math.ceil(data.length / config.perPage)) - 1;
    const sliceStart = pageIndex * config.perPage;
    const sliceEnd   = sliceStart + config.perPage;
    return data.slice(sliceStart, sliceEnd);
  }

  processData (data: T[]): T[] {
    data = this.filterData(data);
    data = this.sortData(data);
    data = this.paginateData(data);
    return data;
  }
}
