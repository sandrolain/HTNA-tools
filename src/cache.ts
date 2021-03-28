
// type ArgumentTypes<F extends (...args: any) => any> = F extends (...args: infer A) => any ? A : never;

const memo: Map<(...args: any) => any, Map<string, { expire: number; data: any }>> = new Map();

export function callMemoized<T extends (...args: any) => any>(time: number, fn: T, ...args: [...Parameters<T>]): ReturnType<T> {
  const key = JSON.stringify(args);

  let cache = memo.get(fn) as Map<string, { expire: number; data: ReturnType<T> }>;

  if(!cache) {
    cache = new Map();
    memo.set(fn, cache);
  }

  const now = Date.now();
  const cachedResult = cache.get(key);

  if(cachedResult && cachedResult.expire > now) {
    return cachedResult.data;
  }

  const expire = (now + time);
  const data   = fn(...args);

  cache.set(key, { expire, data });

  return data;
}
