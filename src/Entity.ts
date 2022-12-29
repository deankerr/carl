import { Components, Entity, position, render, tagPlayer } from './Components'

export class Builder {
  components: Components = {}

  build(id: string): Entity {
    const entity = { id, ...this.components }
    return entity
  }

  position(x: number, y: number) {
    this.components = { ...position(x, y), ...this.components }
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
}
