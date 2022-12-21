// export const Point = (x: number, y: number) => {
//   return { x, y }
// }

// export interface Rect {}

export class Rect {
  readonly x: number
  readonly y: number
  readonly x2: number
  readonly y2: number

  readonly width: number
  readonly height: number

  constructor(x: number, y: number, width: number, height: number) {
    // top left
    this.x = x
    this.y = y
    // bottom right
    this.x2 = x + width - 1
    this.y2 = y + height - 1

    this.width = width
    this.height = height
  }

  // Travels through the x/y coords
  traverse(callback: (x: number, y: number) => unknown) {
    // console.log('rect traverse')
    for (let yi = this.y; yi < this.y + this.height - 1; yi++) {
      for (let xi = this.x; xi <= this.x + this.width - 1; xi++) {
        if (callback(xi, yi) === false) return // exit loop if false?
      }
    }
  }

  // Find any rects this intersects, return such rects and {pts?}
  // return null or [] if false?
  // TODO static method?
  // TODO ts generic
  intersects(rect: Rect | Rect[]) {
    console.log('RectI.intersects()')

    let targets = []

    // Convert single rect to arr
    Array.isArray(rect) ? (targets = rect) : (targets = [rect])

    // Find matching
    const targetsMatch = targets.filter((r) => {
      return Rect.intersects(r, this)
    })

    // Return if no match
    if (targetsMatch.length === 0) return null

    // targetsMatch = [rect, rect, rect, ... ]

    // targetMatchPts = [ [rect, [pt, pt, pt, ... ]], [rect, [pt, pt, pt, ... ]], ...]
    // Create pts list
    const targetsMatchPts = targetsMatch.map((targetRect) => {
      const pts: { x: number; y: number }[] = []

      targetRect.traverse((x, y) => {
        // console.log('ints traverse')
        if (Rect.intersectsPt(this, { x, y })) pts.push({ x, y })
      })

      return [targetRect, pts]
    })

    console.assert(
      targetsMatchPts.length > 0,
      "No points found after match check, this shouldn't happen",
      rect,
      targetsMatchPts
    )

    return targetsMatchPts.length === 1 ? targetsMatchPts[0] : targetsMatchPts

    // console.log('rectPts', rect, match, rectPts)
    // return match.length > 0 ? match : null

    // return [ [rect, [pt, pt, pt, ...] ], [rect, [pt, pt, pt, ...] ] ]
  }

  // ? within(pt) ?

  static at(x: number, y: number, width: number, height: number) {
    return new Rect(x, y, width, height)
  }

  static scaled(x: number, y: number, xScale: number, yScale: number) {
    const width = 2 * xScale - 1
    const height = 2 * yScale - 1
    const x1 = x - Math.floor(width / 2)
    const y1 = y - Math.floor(height / 2)

    return new Rect(x1, y1, width, height)
  }

  // TODO do main checking here?
  static intersects(rect1: Rect, rect2: Rect) {
    if (rect1 === rect2) console.warn('Did you mean to check if a rect intersects itself?', rect1, rect2)
    return !(rect1.x2 < rect2.x || rect1.y2 < rect2.y || rect1.x > rect2.x2 || rect1.y > rect2.y2)
  }

  // TODO naming? "pt"? overload with rect:rect function?
  static intersectsPt(rect: Rect, pt: { x: number; y: number }) {
    return pt.x >= rect.x && pt.y >= rect.y && pt.x <= rect.x2 && pt.y <= rect.y2
  }
}

// export function RectXY(x: number, y: number, width: number, height: number) {
//   return new Rect(x, y, width, height)
// }
// // 1 = 1, 2 = 3, 3 = 5, 4 = 7
// // scale => w/h in odd numbered increments
// export function RectC(x: number, y: number, xScale: number, yScale: number) {
//   const width = 2 * xScale - 1
//   const height = 2 * yScale - 1
//   const x1 = x - Math.floor(width / 2)
//   const y1 = y - Math.floor(height / 2)

//   return new Rect(x1, y1, width, height)
// }
