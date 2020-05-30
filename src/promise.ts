export interface LoaderManagerOptions {
  beforeStart?: (stats: LoaderManagerStats) => void;
  progress?: (stats: LoaderManagerStats) => void;
  complete?: (stats: LoaderManagerStats) => void;
  error?: (error: Error) => void;
}

export interface LoaderManagerStats {
  resolved: number;
  rejected: number;
  passed: number;
  total: number;
}

export class LoaderManager {
  private promises: Promise<any>[] = [];
  private running: Promise<LoaderManagerStats>;

  constructor (private options: LoaderManagerOptions) {}

  addPromise (promises: Promise<any> | Promise<any>[]): void {
    this.promises = this.promises.concat(promises);
    this.process();
  }

  process (): Promise<LoaderManagerStats> {
    if(this.running) {
      return this.running;
    }

    this.running = (async (): Promise<LoaderManagerStats> => {
      const stats: LoaderManagerStats = {
        resolved: 0,
        rejected: 0,
        passed: 0,
        total: 0
      };

      if(this.options.beforeStart) {
        try {
          this.options.beforeStart(stats);
        } catch(e) {
          if(this.options.error) {
            this.options.error(e);
          }
        }
      }

      if(this.options.progress) {
        try {
          this.options.progress(stats);
        } catch(e) {
          if(this.options.error) {
            this.options.error(e);
          }
        }
      }

      while(this.promises.length > 0) {
        try {
          await this.promises.shift();
          stats.resolved++;
        } catch(e) {
          stats.rejected++;
        }

        stats.passed++;
        stats.total = this.promises.length + stats.passed;

        if(this.options.progress) {
          try {
            this.options.progress(stats);
          } catch(e) {
            if(this.options.error) {
              this.options.error(e);
            }
          }
        }
      }

      if(this.options.complete) {
        try {
          this.options.complete(stats);
        } catch(e) {
          if(this.options.error) {
            this.options.error(e);
          }
        }
      }

      this.running = null;

      return stats;
    })();

    return this.running;
  }
}
