export type Render = { render: { char: string; color: string } }
export type Position = { position: { x: number; y: number } }
export type TagPlayer = { tagPlayer: true }

export type ID = {
  id: string
}
export type ComponentsU = Position | Render | TagPlayer
export type Components = Partial<Position & Render & TagPlayer>
export type Entity = ID & Components

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
