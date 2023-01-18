// TODO add charMap type safety
export type Graphic = { char: string; color: string }
export const graphic = (char: string, color: string) => {
  return { char, color }
}

export type BaseGraphic = { base: Graphic }
export const baseGraphic = (char: string, color: string) => {
  return { char, color, base: { char, color } }
}
