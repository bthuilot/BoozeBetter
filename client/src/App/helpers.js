export function formatErrors(error) {
  return `${error.msg}. ${error.value ? `(value given ${error.value})` : ''}`;
}

export function dummy(num) {
  return 15 * 10 + num;
}
