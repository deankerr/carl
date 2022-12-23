import * as ROT from 'rot-js'

export interface Point {
  x: number
  y: number
}

export function Pt(x: number, y: number): Point {
  // if (x < 0 || y < 0) console.warn('point: do you really want a negative point?', x, y)
  return { x, y }
}

// export class Point {
//   x: number
//   y: number
//   constructor(x: number, y: number) {
//     this.x = x
//     this.y = y
//   }
// }

export interface Rect {
  from: Point // top left
  to: Point // top right
  width: number
  height: number
}

export interface Rect2 {
  lx: number // "from"/ top left
  ly: number
  cx: number // centre
  cy: number
  rx: number // "to"/ bottom right
  ry: number
  w: number // width
  h: number // height
  inner: Rect2 | null
  outer: Rect2 | null
}

// export function Rect(fromA: number[], toA: number[]): Rect
export function Rect(from: Point | number[], to: Point | number[]): Rect {
  if ('x' in from && 'x' in to) {
    return { from, to, width: to.x - from.x + 1, height: to.y - from.y + 1 }
  }

  if ('length' in from && 'length' in to) {
    return { from: Pt(from[0], from[1]), to: Pt(to[0], to[1]), width: to[0] - from[0] + 1, height: to[1] - from[1] + 1 }
  }

  throw new Error('Rect: invalid dimensions' + from + to)
}

// Rect2 into class / static methods ?
export function Rect2(lx: number, ly: number, rx: number, ry: number): Rect2 {
  return {
    lx,
    ly,
    cx: lx + Math.floor(rx - lx),
    cy: ly + Math.floor(ry - ly),
    rx,
    ry,
    w: rx - lx + 1,
    h: ry - ly + 1,
    inner: null,
    outer: null,
  }
}

export function Rect2C(c: Point, w: number, h: number): Rect2 {
  const l = Pt(c.x - Math.floor(w / 2), c.y - Math.floor(h / 2))
  const r = Pt(l.x + w - 1, l.y + h - 1)
  return {
    cx: c.x,
    cy: c.y,
    lx: l.x,
    ly: l.y,
    rx: r.x,
    ry: r.y,
    w,
    h,
    inner: null,
    outer: null,
  }
}

export function Rect2Grow(r: Rect2, n = 1): Rect2 {
  return Rect2(r.lx - n, r.ly - n, r.rx + n, r.ry + n)
}

export function enlargeRect(r: Rect, by = 1) {
  return Rect(Pt(r.from.x - by, r.from.y - by), Pt(r.to.x + by, r.to.y + by))
}

export function growRect2(r: Rect2, n = 1) {
  return Rect2(r.lx - n, r.ly - n, r.ly + n, r.ly + n)
}

export function rectsIntersect(r1: Rect, r2: Rect) {
  // left
  // if (r1.to.x < r2.from.x) return false
  // // above
  // if (r1.to.y < r2.from.y) return false
  return !(r1.to.x < r2.from.x || r1.to.y < r2.from.y || r1.from.x > r2.to.x || r1.from.y > r2.to.y)
  // return true
}

export function Rect2Intersect(r1: Rect2, r2: Rect2) {
  const hit = !(r1.rx < r2.lx || r1.ry < r2.ly || r1.lx > r2.rx || r1.ly > r2.ry)
  return hit
}

export function Rect2IntersectPt(r: Rect2, p: Point) {
  // console.log('Rect2IPt', r, p, r.lx <= p.x && r.ly <= p.y && r.rx >= p.x && r.ry >= p.y)
  // console.log(r.lx >= p.x)
  // console.log(r.ly >= p.y)
  // console.log(r.rx <= p.x)
  // console.log(r.ry <= p.y)
  return r.lx <= p.x && r.ly <= p.y && r.rx >= p.x && r.ry >= p.y
}

export function Rect2RndPt(r: Rect2) {
  const x = ROT.RNG.getUniformInt(r.lx, r.rx)
  const y = ROT.RNG.getUniformInt(r.ly, r.ry)
  return Pt(x, y)
}
