import { Component } from '.'
export interface Position extends Component {
  x: number
  y: number
}

export function Position(x: number, y: number): Position {
  return { id: 'Position', x, y }
}
