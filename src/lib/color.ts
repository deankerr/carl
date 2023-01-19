import * as ROT from 'rot-js'
import { Color } from 'rot-js/lib/color'
import { min } from './util'

type tHSLOpts = {
  sat: { to?: number; by?: number; min?: number }
  lum: { to?: number; by?: number; min?: number }
}

export function transformHSL(from: string, opts: Partial<tHSLOpts>) {
  const hsl = hexToHSL(from)
  if (opts.sat) {
    const cmin = opts.sat.min ?? 0
    if (opts.sat.to) hsl[1] = min(cmin, opts.sat.to)
    if (opts.sat.by) hsl[1] = min(cmin, hsl[1] * opts.sat.by)
  }

  if (opts.lum) {
    const cmin = opts.lum.min ?? 0
    if (opts.lum.to) hsl[2] = min(cmin, opts.lum.to)
    if (opts.lum.by) hsl[2] = min(cmin, hsl[2] * opts.lum.by)
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
