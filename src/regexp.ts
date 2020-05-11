
// TODO: docs
// TODO: test
export function getRegExpFromString (expression: string | RegExp, mod: string = null): RegExp {
  if(expression instanceof RegExp) {
    return expression;
  }
  return new RegExp(expression, mod);
}
