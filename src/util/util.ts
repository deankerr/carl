export function copy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function str(n: number) {
  return `${n}`
}

export function strCmp(a: object, b: object) {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function objLog(obj: object | object[], label = 'Object Log') {
  if (Array.isArray(obj)) obj.forEach((o, i) => objLog(o, label + i))
  else {
    console.group(label)
    // console.log(JSON.stringify(obj))
    console.log(copy(obj))
    console.groupEnd()
  }
}
