export type Position = { cid: 'Position'; x: number; y: number }

export function Position(x: number, y: number): Position {
  return Object.freeze({ cid: 'Position', x, y })
}
