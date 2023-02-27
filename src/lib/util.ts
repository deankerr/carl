import * as ROT from 'rot-js'

// random int between (inclusive) 0 to n, or n to max
export function rnd(n: number, max?: number) {
  if (max) return ROT.RNG.getUniformInt(n, max)
  return ROT.RNG.getUniformInt(0, n)
}

// odd numbers only
export function rndO(min: number, max: number) {
  const n = rnd(floor(min / 2), floor(max / 2))
  return 2 * n + 1
}

// make a number odd by increasing if necessary
export function makeOdd(n: number) {
  if (n % 2 === 1) return n
  return n + 1
}

// aliases
export function half(n: number) {
  return Math.floor(n / 2)
}

export function floor(n: number) {
  return Math.floor(n)
}

// clamps
export function min(min: number, n: number) {
  return n < min ? min : n
}

export function max(n: number, max: number) {
  return n > max ? max : n
}

export function clamp(min: number, n: number, max: number, debug?: string) {
  if (n < min) return min
  if (n > max) return max
  return n
}

// return a random value from an array
export const pick = <T>(arr: T[]): T => {
  const picked = ROT.RNG.getItem(arr)
  if (picked === null) throw new Error('Tried to pick from an empty array')

  return picked
}

// return a new shuffled array
export const shuffle = <T>(arr: T[]): T[] => {
  return ROT.RNG.shuffle(arr)
}

// call callback n times, exit early if true
export const loop = (times: number, callback: (i: number) => unknown) => {
  for (let i = 0; i < times; i++) {
    if (callback(i)) break
  }
}

// generate a sequence of numbers (for use in for..of)
export function* range(n: number, max?: number, step = 1) {
  let value = max ? n : 0
  const to = max ?? n
  while (value <= to) {
    yield value
    value += step
  }
}

// console.log timer
let anonTimerCount = 0
export function logTimer(name = `Timer ${anonTimerCount++}`) {
  const t = Date.now()
  return {
    stop: (data?: unknown) => {
      console.log(`${name}: ${Date.now() - t}ms`, data ?? '')
    },
  }
}

// debug helper - convert number to symbol
export function nAlpha(n: number) {
  const nSymbols = ['auraWhite', 'auraBlue', 'auraRed', 'auraGreen', 'auraPurple']

  if (n < 0 && n > -6) return nSymbols[Math.abs(n) - 1]
  if (n < 0) return '?'
  if (n > 35) return '!'
  const map = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return map[n]
}

export class Queue<T> {
  queue: T[] = []
  repeat: T[] = []

  constructor(...init: T[]) {
    if (init.length > 0) this.queue = init
  }

  add(item: T, repeat = false) {
    this.queue.push(item)
    if (repeat) this.repeat.push(item)
  }

  next() {
    const item = this.queue.shift()
    if (item !== undefined && this.repeat.includes(item)) this.queue.push(item)
    return item
  }

  remove(item: T) {
    this.queue = this.queue.filter(i => i !== item)
    this.repeat = this.repeat.filter(i => i !== item)
  }
}
