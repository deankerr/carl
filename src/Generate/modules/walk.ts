import { loop, pick, rnd } from '../../lib/util'
import { neighbours4, point, Point } from '../../Model/Point'

// 'drunkard's walk' - randomly move in a direction, returning a pt there
export function walk(
  repeat: number, // times to repeat the entire process (calls start again)
  life: number, // life span of one walk
  start: Point | (() => Point), // point or function that returns a start point
  callback: (pt: Point) => unknown, // result callback
  afterLife?: () => unknown // called after each life (ie. for snapshots)
) {
  loop(repeat, () => {
    let pt = typeof start === 'function' ? start() : start
    loop(life, () => {
      pt = pt.add(pick(neighbours4))
      callback(pt)
    })
    if (afterLife) afterLife()
  })
}

// paint randomly in range of a central point
export function hop(
  repeat: number, // times to repeat the entire process
  life: number,
  range: number, // max radius
  start: Point | (() => Point), // point or function that returns a start point
  callback: (pt: Point) => unknown, // result callback
  afterLife?: () => unknown // called after each life (ie. for snapshots)
) {
  loop(repeat, () => {
    const pt = typeof start === 'function' ? start() : start
    loop(life, () => {
      const hopPt = point(pt.x + rnd(range), pt.y + rnd(range))
      callback(hopPt)
    })
  })
  if (afterLife) afterLife()
}

export function streaker(
  repeat: number, // times to repeat the entire process
  life: number,
  range: number, // max radius
  start: Point | (() => Point), // point or function that returns a start point
  callback: (pt: Point) => unknown, // result callback
  afterLife?: () => unknown // called after each life (ie. for snapshots)
) {
  loop(repeat, () => {
    const pt = typeof start === 'function' ? start() : start
    loop(life, () => {
      const hopPt = point(pt.x + rnd(range), pt.y + rnd(range))
      callback(hopPt)
    })
  })
  if (afterLife) afterLife()
}
