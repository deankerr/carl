import * as ROT from 'rot-js'
import { min } from './util'

// return a hex color with set luminance
export function transformHSL(color: string, lum: number, minLum: number) {
  const c = ROT.Color.rgb2hsl(ROT.Color.fromString(color))
  c[2] = min(minLum, lum)
  return ROT.Color.toHex(ROT.Color.hsl2rgb(c))
}

export function hexLuminance(color: string) {
  const hsl = hexToHSL(color)
  return hsl[2]
}

export function hexToHSL(color: string) {
  return ROT.Color.rgb2hsl(ROT.Color.fromString(color))
}
