export type Render = { render: { char: string; color: string } }
export type Position = { position: { x: number; y: number } }

export type ID = {
  id: string
}
export type Components = Partial<Position & Render>
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
