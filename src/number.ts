
// TODO: docs
// TODO: test
// thx: https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-string
export function formatNumber (value: number, precision: number = 0, decSep: string = ",", sectLen: number = 3, sectSep: string = "."): string {
  const fixed = value
    .toFixed(Math.max(0, ~~precision))
    .replace(".", decSep);

  if(sectLen > 0) {
    const reg = new RegExp(`\\d(?=(\\d{${(sectLen || 3)}})+${(precision > 0 ? "\\D" : "$")})`, "g");
    return fixed.replace(reg, `$&${sectSep}`);
  }

  return fixed;
}
