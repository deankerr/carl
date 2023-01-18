import * as ROT from 'rot-js'
import { Color } from 'rot-js/lib/color'

export type EmitLight = { emitLight: { color: Color } }

export const emitLight = (color: string) => {
  return { emitLight: { color: ROT.Color.fromString(color) } }
}
