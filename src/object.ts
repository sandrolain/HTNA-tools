
// TODO: test
// TODO: docs
export function getDescendantProp (obj: Record<any, any>, desc: string): any {
  const arr = desc.split(/[.[]/);
  while(arr.length > 0 && obj) {
    let prop: string | number = arr.shift();
    if(prop.length === 0) {
      continue;
    }
    if(prop.match(/[0-9]\]$/)) {
      prop = parseInt(prop.replace("]", ""), 10);
    }
    obj = obj[prop];
  }
  return obj;
}


// TODO: test
// TODO: docs
export function watch<T=any> (object: Record<string | number, T>, callback: (propertyName: string | number) => void): ProxyHandler<Record<string | number, T>> {
  const handler = {
    get (target: Record<string | number, T>, property: string | number, receiver: any): any {
      if(typeof target === "object") {
        try {
          return new Proxy(target[property] as unknown as Record<string | number, T>, handler);
        } catch(err) {
          err;
        }
      }
      return Reflect.get(target, property, receiver);
    },
    defineProperty (target: Record<string | number, T>, property: string | number, descriptor: PropertyDescriptor): boolean {
      callback(property);
      return Reflect.defineProperty(target, property, descriptor);
    },
    deleteProperty (target: Record<string | number, T>, property: string | number): boolean {
      callback(property);
      return Reflect.deleteProperty(target, property);
    }
  };
  return new Proxy(object, handler);
}


// TODO: test
// TODO: docs
export function getPropertiesDiff (object: Record<string, any>): () => string[] {
  const props = Object.getOwnPropertyNames(object);
  return function (): string[] {
    const currentProps = Object.getOwnPropertyNames( window );
    const newProps     = currentProps.filter((key) => !props.includes(key));
    return newProps;
  };
}


// TODO: test
// TODO: docs
export function getPropertiesRollback (object: Record<string, any>): () => string[] {
  const diffFn = getPropertiesDiff(object);
  return function (): string[] {
    const newProps = diffFn();
    for(const key of newProps) {
      delete object[key];
    }
    return newProps;
  };
}
