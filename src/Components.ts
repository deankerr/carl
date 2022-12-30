// ? Integrate builder - functions could take optional object of components
// ? causing them to add themselves to that and return "this" ?
export type Render = { render: { char: string; color: string } }
export type Position = { position: { x: number; y: number } }
export type TagPlayer = { tagPlayer: true }

// currently needed only for updateComponents on world, I probably don't want this
export type ComponentsU = Position | Render | TagPlayer

export type Components = Partial<Position & Render & TagPlayer>
export type EntityID = { id: string }
export type Entity = EntityID & Components

export const render = (char: string, color: string): Render => {
  return {
    render: {
      char,
      color,
    },
  }
}

export const position = (x: number, y: number): Position => {
  return { position: { x, y } }
}

export const tagPlayer = (): TagPlayer => {
  return { tagPlayer: true }
}

export type TESTComponent = { TESTComponent: { test1: string } }
export const TESTComponent = (): TESTComponent => {
  return { TESTComponent: { test1: 'one' } }
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

  render(char: string, color: string) {
    this.components = { ...render(char, color), ...this.components }
    return this
  }

  tagPlayer() {
    this.components = { ...tagPlayer(), ...this.components }
    return this
  }
}
