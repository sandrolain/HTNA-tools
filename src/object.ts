
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
