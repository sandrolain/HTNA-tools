
// TODO: docs
// TODO: test
export function executeSourceWithArguments<T=any> (source: string, argsMap: Map<string, any>): T {
  const argsNames = [];
  const argsValues = [];
  for(const [name, value] of argsMap.entries()) {
    argsNames.push(name);
    argsValues.push(value);
  }
  argsNames.push(source);
  const func = new Function(...argsNames);
  return func(...argsValues);
}
