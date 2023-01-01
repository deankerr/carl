// TODO Integrate builder/remove duplication
// ? causing them to add themselves to that and return "this" ?

import { Point } from '../Model/Point'

export type Render = { render: { char: string; color: string } }
export type Position = { position: { x: number; y: number } }
export type TagPlayer = { tagPlayer: true }
export type FOV = { fov: { radius: number; visible: string[] } }
export type Seen = { seen: { visible: string[] } }
export type TagCurrentTurn = { tagCurrentTurn: true }
export type TagWalkable = { tagWalkable: true }
export type TagActor = { tagActor: true }

// currently needed only for updateComponents on world, I probably don't want this
export type ComponentsU = Position | Render | TagPlayer | FOV | Seen | TagCurrentTurn | TagWalkable | TagActor

export type Components = Partial<Position & Render & TagPlayer & FOV & Seen & TagCurrentTurn & TagWalkable & TagActor>
export type EntityID = { id: string }
export type Entity = EntityID & Components

export const render = (char: string, color: string): Render => {
  return { render: { char, color } }
}

export const position = (x: number, y: number): Position => {
  return { position: { x, y } }
}

export const tagPlayer = (): TagPlayer => {
  return { tagPlayer: true }
}

export const fov = (radius: number): FOV => {
  return { fov: { radius, visible: [] } }
}

export const seen = (pts?: string[]): Seen => {
  return { seen: { visible: pts ?? [] } }
}

export const tagCurrentTurn = (): TagCurrentTurn => {
  return { tagCurrentTurn: true }
}

export const tagWalkable = (): TagWalkable => {
  return { tagWalkable: true }
}

export const tagActor = (): TagActor => {
  return { tagActor: true }
}

export class Builder {
  components: Components = {}

  build(id = ''): Entity {
    const entity = { id, ...this.components }
    return entity
  }

  position(x: number, y: number) {
    this.components = { ...position(x, y), ...this.components }
    return this
  }

  positionPt(pt: Point) {
    this.components = { ...position(pt.x, pt.y), ...this.components }
    return this
  }

  render(char: string, color: string) {
    this.components = { ...render(char, color), ...this.components }
    return this
  }

  tagPlayer() {
    this.components = { ...tagPlayer(), ...this.components }
    return this
  }

  fov(radius: number) {
    this.components = { ...fov(radius), ...this.components }
    return this
  }

  seen() {
    this.components = { ...seen(), ...this.components }
    return this
  }

  tagWalkable() {
    this.components = { ...tagWalkable(), ...this.components }
    return this
  }

  tagCurrentTurn() {
    this.components = { ...tagCurrentTurn(), ...this.components }
    return this
  }

  tagActor() {
    this.components = { ...tagActor(), ...this.components }
    return this
  }
}

export function Build() {
  return new Builder()
}
