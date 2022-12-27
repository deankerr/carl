// Not sure if I even need an "Entity" class?
// Entities are just IDs in a component list?

// type Y = { [K in keyof X]: {kind: K, payload: X[K]} }

// type Keys = { [K in Components['cid']]: Components}
// Just creates IDs? Provides an interface for entities?
// import * as Component from './Components'

// how do i do this
// type Components =  C.ConsoleRender | C.Position
// type test = {[ K in keyof Components]: v}
// type Keys = { [K in Components['cid']]: Components }

// ? components stored in central array, entity responds with index of their comp if they have, -1 if not
import { Position, ConsoleRender } from './Components'
type EntComps = {
  Position?: Position
  ConsoleRender?: ConsoleRender
}
export class Entity {
  components: EntComps = {}
  constructor(readonly id: number) {}
}
