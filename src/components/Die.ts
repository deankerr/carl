import { Component } from '.'

export interface Die extends Component {
  id: 'Die'
}

export function Die(): Die {
  return { id: 'Die' }
}
