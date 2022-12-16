import { Component } from '.'

export interface Player extends Component {
  id: 'Player'
}

export function Player(): Player {
  return { id: 'Player' }
}
