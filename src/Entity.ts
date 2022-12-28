// Not sure if I even need an "Entity" class?
// Entities are just IDs in a component list?

// type Y = { [K in keyof X]: {kind: K, payload: X[K]} }

// type Keys = { [K in Components['cid']]: Components}
// Just creates IDs? Provides an interface for entities?
// import type * as Components from './Components'
// type Components =  C.ConsoleRender | C.Position

// how do i do this
// type test = {[ K in keyof Components]: v}
type Keys = { [K in Components['cid']]: Components }

// ? components stored in central array, entity responds with index of their comp if they have, -1 if not
import { Position, ConsoleRender } from './Components'
type EntComps = {
  Position?: Position
  ConsoleRender?: ConsoleRender
}
export class Entity {
  components: EntComps = {}
  comps2: CompStrings = {}
  constructor(readonly id: number) {}
}

import * as withC from './Components'
type Components = ConsoleRender | Position
type CompStrings = {
  ConsoleRender: ConsoleRender
  Position: Position
}
// ? Entity { static build()... } ?
// ? new component storage model in comp arrays - publish built comps in final step?
export class Entity2 {
  comps: CompStrings
  constructor(readonly id: number) {}
}

export class Entity2Builder {
  with = withC
  comps: Components[] = []
  constructor(readonly id: number) {}

  Position(x: number, y: number) {
    this.comps.push(Position(x, y))
    return this
  }

  ConsoleRender(char: string, color: string) {
    this.comps.push(ConsoleRender(char, color))
    return this
  }

  done() {
    // create { Position: {Position}, Console: {Console} }
    let newComps: CompStrings = {}

    this.comps.forEach((c) => {
      newComps[c.cid] = c
    })

    const e = new Entity(this.id)
  }
}

const teste = new Entity2Builder(1).Position(1, 2).ConsoleRender('d', 'blue')

console.log('teste:', teste)
