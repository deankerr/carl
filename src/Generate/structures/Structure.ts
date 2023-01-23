/* eslint-disable @typescript-eslint/no-unused-vars */
import Rect from 'rot-js/lib/display/rect'
import { rnd } from '../../lib/util'
import { Pt } from '../../Model/Point'
import { Rectangle } from '../../Model/Rectangle'
import { Marker, Terrain } from '../../Templates'
import { Mutator, Overseer } from '../Overseer'

export class Structure {
  rect: Rectangle // the total area which contains a structure
  sub: Structure[] = []
  overseer: Overseer
  constructor(rect: Rectangle, overseer: Overseer) {
    this.rect = rect
    this.overseer = overseer

    console.log(this, rect.width, rect.height)

    const mut = this.overseer.mutate()
    const mark = Marker()
    this.rect.traverse(pt => mut.visual(pt, mark))
  }

  // split the main rect into two sub rects
  bisect(area?: Structure) {
    const self = area?.rect ?? this.rect //tvhis.rect.scale(-1)
    // choose either a width or height to split at
    const dir = self.width >= self.height
    const splitPt1 = dir ? Pt(self.cx - 1, self.y2) : Pt(self.x2, self.cy - 1)
    const splitPt2 = dir ? Pt(self.cx + 1, self.y) : Pt(self.x, self.cy + 1)
    const sub1 = new Structure(Rectangle.atxy2(Pt(self.x, self.y), splitPt1), this.overseer)
    const sub2 = new Structure(Rectangle.atxy2(splitPt2, Pt(self.x2, self.y2)), this.overseer)

    // border region
    const splitC = dir
      ? Rectangle.at(Pt(self.cx, self.y), 1, self.height)
      : Rectangle.at(Pt(self.x, self.cy), self.width, 1)
    const sub3 = new Structure(splitC, this.overseer)
    this.sub.push(sub1, sub2, sub3)

    return [sub1, sub2, sub3]
  }

  inner(width: number, height: number) {
    const self = this.rect

    const x = rnd(self.x, self.x2 - width)
    const y = rnd(self.y, self.y2 - height)
    const sub = new Structure(Rectangle.at(Pt(x, y), width, height), this.overseer)
    this.sub.push(sub)

    return sub
  }

  shell() {
    console.log('shell')
    const inner = new Structure(this.rect.scale(-1), this.overseer)
    this.sub.push(inner)

    return inner
  }

  walls() {
    const self = this.rect
    const mutator = this.overseer.mutate()

    self.traverse((pt, edge) => {
      if (edge) mutator.set(pt, Terrain.wall)
    })
  }
}
