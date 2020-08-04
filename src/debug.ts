export const LEVEL_ERROR = 1;
export const LEVEL_WARN = 2;
export const LEVEL_INFO = 4;
export const LEVEL_DEBUG = 8;
export const LEVEL_TRACE = 16;
export const LEVEL_ALL = 31;

export type HandlerFunction = (logLevel: number, logTime: Date, log: any[]) => any;

export function handlerForLevel (level: number, handler: HandlerFunction): HandlerFunction {
  return (logLevel: number, logTime: Date, log: any[]): any => {
    if((level & logLevel) > 0) {
      return handler(logLevel, logTime, log);
    }
  };
}


const consoleMethodsMap: Record<number, string> = {
  [LEVEL_ERROR]: "error",
  [LEVEL_WARN]: "warn",
  [LEVEL_INFO]: "info",
  [LEVEL_DEBUG]: "debug",
  [LEVEL_TRACE]: "trace"
};


export function consoleHandler (logLevel: number, logTime: Date, log: any[]): void{
  const methodName = consoleMethodsMap[logLevel];
  if(methodName && methodName in console) {
    (console as any)[methodName](`[${logTime.toISOString()}][${methodName}]>`, ...log);
  }
}


export class Logger {
  constructor (private handlers: HandlerFunction[] = []) {}

  captureErrors (): void {
    window.addEventListener("error", (event: ErrorEvent) => {
      this.error(event);
    });
    window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
      event.preventDefault();
      this.error(event.reason);
    });
  }

  private handleLog (logLevel: number, log: any[]): void {
    const logTime = new Date();
    for(const handler of this.handlers) {
      try {
        handler(logLevel, logTime, log);
      } catch(e) {
        //
      }
    }
  }

  error (...log: any[]): void {
    this.handleLog(LEVEL_ERROR, log);
  }

  warn (...log: any[]): void {
    this.handleLog(LEVEL_WARN, log);
  }

  info (...log: any[]): void {
    this.handleLog(LEVEL_INFO, log);
  }

  debug (...log: any[]): void {
    this.handleLog(LEVEL_DEBUG, log);
  }

  trace (...log: any[]): void {
    this.handleLog(LEVEL_TRACE, log);
  }
}
