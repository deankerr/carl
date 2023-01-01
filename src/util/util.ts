export function copy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function str(n: number) {
  return `${n}`
}

export function strCmp(a: object, b: object) {
  return JSON.stringify(a) === JSON.stringify(b)
}
