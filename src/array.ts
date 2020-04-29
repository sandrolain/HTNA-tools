// TODO: fix functions

export function unique<T=any> (arr: T[], prop: string = null): T[] {
  if(prop) {
    return [...new Set(arr.map((elem: T) => (elem as any)[prop]))];
  }
  return [...new Set(arr)];
}


export function intersect<T=any> (...arrs: T[][]): T[] {
  const first = arrs.shift();
  return arrs.reduce((acc, it) => acc.filter(elem => it.includes(elem)), first);
}

const getRegExpFromString = (regEx: string | RegExp, mod: string = null): RegExp => {
  if(typeof regEx === "string") {
    return new RegExp(regEx, mod);
  }
  return regEx;
};

export function searchRE<T=any> (arr: T[], regEx: RegExp | string, prop: string = null): T[] {
  const ereg: RegExp = getRegExpFromString(regEx);
  if(prop) {
    return arr.filter((elem: T) => ereg.test(elem[prop]));
  }
  return arr.filter((elem: T) => ereg.test(elem));
}

export function searchREi<T=any> (arr: T[], query: string, prop: string = null): T[] {
  return searchRE(arr, new RegExp(query, "i"), prop);
}

export function search<T=any> (arr: T[], query: string | RegExp, prop: string = null): T[] {
  if(prop) {
    return arr.filter((elem) => elem[prop].includes(query));
  }
  return arr.filter((elem) => elem.includes(query));
}

export function flatten (arr) {
  return arr.reduce((acc, it) => [...acc, ...it], []);
}

export function stat (arr, prop = null) {
  return arr.reduce((acc, it) =>
  {
    const key = prop ? it[prop] : it;

    acc[key] = acc[key] + 1 || 1;

    return acc;
  }, {});
}

export function indexing (arr, prop) {
  return arr.reduce((acc, it) => (acc[prop] = it, acc), {});
}


export function mapReversal (obj) {
  return Object.keys(obj).reduce(
    (acc, k) => (acc[obj[k]] = [...(acc[obj[k]] || []), k], acc) , {}
  );
}

export function encodeQueryString (params, amp = "&") {
  return Object.entries(params).map(p => `${encodeURIComponent(p[0])}=${encodeURIComponent(p[1])}`).join(amp)
}
