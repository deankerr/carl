import * as ROT from 'rot-js'
import { Color } from 'rot-js/lib/color'
import { min } from './util'

type tHSLOpts = {
  sat: { to: number; min: number }
  lum: { to: number; min: number }
}

export function transformHSL(from: string, opts: Partial<tHSLOpts>) {
  const hsl = hexToHSL(from)
  if (opts.sat) {
    hsl[1] = min(opts.sat.min, opts.sat.to)
  }

  if (opts.lum) {
    hsl[2] = min(opts.lum.min, opts.lum.to)
  }

  return HSLToHex(hsl)
}

// return a hex color with set luminance
export function setLuminance(color: string, lum: number, minLum: number) {
  const c = hexToHSL(color)
  c[2] = min(minLum, lum)
  return HSLToHex(c)
}

export function hexLuminance(color: string) {
  const hsl = hexToHSL(color)
  return hsl[2]
}

export function hexToHSL(color: string) {
  return ROT.Color.rgb2hsl(ROT.Color.fromString(color))
}

export function HSLToHex(color: Color) {
  return ROT.Color.toHex(ROT.Color.hsl2rgb(color))
}
