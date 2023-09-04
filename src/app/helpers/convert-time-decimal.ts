export function timeToDecimal(t) {
  t = t.split(':');
  return parseInt(t[0], 10)*1 + parseInt(t[1], 10)/60;
}
