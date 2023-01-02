import { Component } from '.'

export interface BlockMovement extends Component {
  id: 'BlockMovement'
}

export function BlockMovement(): BlockMovement {
  return { id: 'BlockMovement' }
}
