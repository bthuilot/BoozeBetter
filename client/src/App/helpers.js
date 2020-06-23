export function formatErrors(error) {
  return `${error.msg}. ${error.value ? `(value given ${error.value})` : ""}`;
}
