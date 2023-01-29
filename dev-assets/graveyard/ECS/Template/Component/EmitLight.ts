export type EmitLight = { emitLight: { color: string; frequency: number; current: boolean; lastUpdate: number } }

export const emitLight = (color: string, frequency = 0, current = false, lastUpdate = 0): EmitLight => {
  return { emitLight: { color, frequency, current, lastUpdate } }
}
