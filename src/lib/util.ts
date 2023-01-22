import * as ROT from 'rot-js'

export function copy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function str(n: number) {
  return `${n}`
}

export function strCmp(a: object, b: object) {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function objLog(obj: object | object[], label = 'Object Log', collapsed = false) {
  if (Array.isArray(obj)) obj.forEach((o, i) => objLog(o, label + i, collapsed))
  else {
    collapsed ? console.groupCollapsed(label) : console.group(label)
    // console.log(JSON.stringify(obj))
    console.log(copy(obj))
    console.groupEnd()
  }
}

export function rnd(min: number, max?: number): number {
  if (max) return ROT.RNG.getUniformInt(min, max)
  return ROT.RNG.getUniformInt(0, min)
}

export function half(n: number) {
  return Math.floor(n / 2)
}

export function floor(n: number) {
  return Math.floor(n)
}

export function min(min: number, n: number) {
  return n < min ? min : n
}

export function clamp(min: number, n: number, max: number, debug?: string) {
  debug && console.log(`clamp ${debug} ${n} - min: ${min} ${n < min} / max: ${max} ${n > max}`)
  if (n < min) return min
  if (n > max) return max
  return n
}

export const pick = <T>(arr: T[]): T => {
  const picked = ROT.RNG.getItem(arr)
  if (!picked) throw new Error('Tried to pick from an empty array')
  return picked
}

export const mix = <T>(arr: T[]): T[] => {
  return ROT.RNG.shuffle(arr)
}

export const repeat = (times: number, callback: (i: number) => unknown) => {
  for (let i = 0; i < times; i++) {
    if (callback(i)) break
  }
}

// exit repeat loop if callback returned true
export const repeatUntil = (callback: () => unknown, times: number) => {
  for (let i = 0; i < times; i++) {
    if (callback()) break
  }
}

export function* range(n: number, max?: number, step = 1) {
  let value = max ? n : 0
  const to = max ?? n
  while (value <= to) {
    yield value
    value += step
  }
}
