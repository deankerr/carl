export class PointManager {
  store = new Map<string, Point>()
  count = 0

  pt(x: number, y: number) {
    const s = x + ',' + y
    const storedPt = this.store.get(s)
    if (storedPt) return storedPt
    const pt = new Point(x, y, this.count++)
    this.store.set(s, pt)
    return pt
  }

  grid(width: number, height: number, callback: (pt: Point) => unknown) {
    for (let yi = 0; yi < height; yi++) {
      for (let xi = 0; xi < width; xi++) {
        callback(this.pt(xi, yi))
      }
    }
  }
}

export const PointMan = new PointManager()

export class Point {
  readonly s: string
  constructor(readonly x: number, readonly y: number, readonly pID = 0) {
    this.s = `${this.x},${this.y}`
  }

  add(vector: Point | string | number, y?: number) {
    let pt: Point
    if (typeof vector === 'number') {
      if (typeof y === 'number') pt = Pt(vector, y)
      else throw new Error('Both parameters must be number')
    } else if (typeof vector === 'string') {
      pt = strToPt(vector)
    } else pt = vector

    return Pt(this.x + pt.x, this.y + pt.y)
  }

  neighbours4() {
    return orthNeighbours().map(n => this.add(n))
  }

  neighbours8() {
    return neighbours().map(n => this.add(n))
  }
}

function Pt(x: number, y: number) {
  return PointMan.pt(x, y)
}

export function strToPt(s: string | Point) {
  if (typeof s === 'string') {
    const pt = s.split(',')
    return PointMan.pt(parseInt(pt[0]), parseInt(pt[1]))
  } else return s
}

export function ptToStr(pt: Point | string) {
  if (typeof pt === 'string') {
    return pt
  } else {
    return pt.s
  }
}

function neighbours() {
  return [Pt(0, -1), Pt(1, -1), Pt(1, 0), Pt(1, 1), Pt(0, 1), Pt(-1, 1), Pt(-1, 0), Pt(-1, -1)]
}
function orthNeighbours() {
  return [Pt(0, -1), Pt(1, 0), Pt(0, 1), Pt(-1, 0)]
}

// export class PointSet {
//   private set = new Set<string>()
//   constructor(...args: Point[] | string[]) {
//     for (const pt of args) {
//       if (typeof pt === 'string') {
//         this.set.add(pt)
//       } else {
//         this.set.add(pt.s)
//       }
//     }
//   }

//   add(pt: Point | string) {
//     this.set.add(ptToStr(pt))
//   }

//   has(pt: Point | string) {
//     return this.set.has(ptToStr(pt))
//   }

//   del(...args: Point[] | string[]) {
//     args.forEach(a => this.set.delete(ptToStr(a)))
//   }

//   toPt() {
//     const sPtA = [...this.set]
//     return sPtA.map(pts => strToPt(pts))
//   }
// }
