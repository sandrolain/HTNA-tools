
// TODO: test
// TODO: docs
export async function fetchText (input: RequestInfo, init?: RequestInit): Promise<string> {
  const result = await fetch(input, init);
  if(!result.ok) {
    throw new Error(`Failed Request with status: ${result.status} ${result.statusText}`);
  }
  return await result.text();
}

// TODO: test
// TODO: docs
export async function fetchJSON (input: RequestInfo, init?: RequestInit): Promise<any> {
  const result = await fetch(input, init);
  if(!result.ok) {
    throw new Error(`Failed Request with status: ${result.status} ${result.statusText}`);
  }
  return await result.json();
}

// TODO: test
// TODO: docs
export async function fetchBlob (input: RequestInfo, init?: RequestInit): Promise<any> {
  const result = await fetch(input, init);
  if(!result.ok) {
    throw new Error(`Failed Request with status: ${result.status} ${result.statusText}`);
  }
  return await result.blob();
}

// TODO: test
// TODO: docs
export async function fetchTemplate (input: RequestInfo, init?: RequestInit): Promise<HTMLTemplateElement> {
  const result = await fetch(input, init);
  if(!result.ok) {
    throw new Error(`Failed Request with status: ${result.status} ${result.statusText}`);
  }
  const html = await result.text();
  const node = document.createElement("template");
  node.innerHTML = html;
  return node;
}


export type InterceptorRequest = RequestInit & { url: string};

// TODO: test
// TODO: docs
export class Interceptor {

  constructor (
    private requests: ((request: Request) => Request | Promise<Request>)[] = [],
    private responses: ((response: Response) => Response | Promise<Response>)[] = []
  ) {}

  // TODO: test
  // TODO: docs
  interceptRequest (fn: (request: Request) => Request | Promise<Request>): void {
    this.requests.push(fn);
  }

  // TODO: test
  // TODO: docs
  interceptResponse (fn: (response: Response) => Response | Promise<Response>): void {
    this.responses.push(fn);
  }

  // TODO: test
  // TODO: docs
  getFetcher (): (input: RequestInfo, init?: RequestInit) => Promise<Response> {
    return async (input: RequestInfo, init?: RequestInit): Promise<Response> => {

      let request = (input instanceof Request) ? input : new Request(input, init);

      for(const fn of this.requests) {
        const res = fn(request);
        request = (res instanceof Promise) ? await res : res;
      }

      let response = await fetch(request);

      for(const fn of this.responses) {
        const res = fn(response);
        response = (res instanceof Promise) ? await res : res;
      }

      return response;
    };
  }
}
