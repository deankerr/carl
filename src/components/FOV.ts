import { Component } from '.'

export interface FOV extends Component {
  id: 'FOV'
  radius: number
  visible: { [key: string]: boolean }
}

export function FOV(radius: number): FOV {
  return { id: 'FOV', radius, visible: {} }
}
