import { getDescendantProp } from "./object";
import { getRegExpFromString } from "./regexp";

// TODO: docs
// TODO: test
export function unique<T=any> (arr: T[], prop?: string): T[] {
  if(prop) {
    return [...new Set(arr.map((elem: T) => (elem as any)[prop]))];
  }
  return [...new Set(arr)];
}

// TODO: docs
// TODO: test
export function intersect<T=any> (...arrs: T[][]): T[] {
  const first = arrs.shift();
  return arrs.reduce((acc, it) => acc.filter(elem => it.includes(elem)), first);
}

// TODO: docs
// TODO: test
export function search (arr: string[], query: string): string[] {
  return arr.filter((elem) => elem.includes(query));
}

// TODO: docs
// TODO: test
export function searchProp (arr: Record<string | number, string>[], prop: string | number, query: string): Record<string | number, string>[] {
  return arr.filter((elem) => elem[prop].includes(query));
}

// TODO: docs
// TODO: test
export function searchRE (arr: string[], expression: RegExp | string, mod?: string): string[] {
  const ereg: RegExp = getRegExpFromString(expression, mod);
  return arr.filter((elem: string) => ereg.test(elem));
}

// TODO: docs
// TODO: test
export function searchPropRE (arr: Record<string | number, string>[], prop: string | number, expression: RegExp | string, mod?: string): Record<string | number, string>[] {
  const ereg: RegExp = getRegExpFromString(expression, mod);
  return arr.filter((elem) => ereg.test(elem[prop]));
}

// TODO: docs
// TODO: test
export function flatten<T=any> (arr: T[][]): T[] {
  return arr.reduce((acc, it) => [...acc, ...it], []);
}

// TODO: docs
// TODO: test
export function stat (arr: (string | number)[]): Record<string | number, number> {
  return arr.reduce((acc, value) => {
    if(!acc[value]) {
      acc[value] = 0;
    }
    acc[value]++;
    return acc;
  }, {} as Record<string | number, number>);
}

// TODO: docs
// TODO: test
export function statProp (arr: Record<string | number, string | number>[], prop: string | number): Record<string | number, number> {
  return stat(arr.map((value) => value[prop]));
}

// TODO: docs
// TODO: test
export function index (arr: Record<string | number, string | number>[], prop: string | number): Record<string | number, (string | number)[]> {
  return arr.reduce((acc, value) => {
    if(!acc[prop]) {
      acc[prop] = [];
    }
    acc[prop].push(value[prop]);
    return acc;
  }, {} as Record<string | number, (string | number)[]>);
}

type recordkey = string | number;

// TODO: docs
// TODO: test
export function mapReversal (obj: Record<recordkey, recordkey>): Record<recordkey, recordkey[]> {
  const acc: Record<recordkey, recordkey[]> = {};
  return Object.keys(obj).reduce(
    (acc, k: recordkey) => (acc[obj[k]] = [...(acc[obj[k]] || []), k], acc),
    acc
  );
}

// TODO: docs
// TODO: test
export function encodeQueryString (params: Record<string, any> | Map<string, any>, amp: string = "&"): string {
  return Object.entries(params).map(p => `${encodeURIComponent(p[0])}=${encodeURIComponent(p[1])}`).join(amp);
}

// TODO: docs
// TODO: test
export function sortByDescendantProp (data: Record<string, any>[], prop: string, func?: (a: Record<string, any>, b: Record<string, any>) => number): Record<string, any>[] {
  return data.slice().sort((a, b): number => {
    const aValue = getDescendantProp(a, prop);
    const bValue = getDescendantProp(b, prop);
    if(func) {
      return func(aValue, bValue);
    }
    return aValue === bValue ? 0 : (aValue < bValue ? -1 : 1);
  });
}
