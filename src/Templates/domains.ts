// define domains

const flameTest = {
  label: 'flameTest',
  revealed: true,
  playerFOV: 12,
  generator: 'flameTest',
  connections: { top: '', ascend: '', descend: '' },
}

export const domains = [
  flameTest,
  {
    label: 'outdoor',
    revealed: true,
    playerFOV: 12,
    generator: 'outdoor',
    connections: {
      // ascend: 'ruin'
      top: '',
      ascend: '',
      descend: 'dungeon',
    },
  },

  {
    label: 'dungeon',
    revealed: false,
    playerFOV: 7,
    generator: 'dungeon4',
    connections: {
      top: 'outdoor',
      ascend: 'dungeon',
      descend: 'dungeon',
      // bottom: 5 specify dungeon depth?
    },
  },

  // ruin: {
  //   revealed: false,
  //   playerFOV: 8,
  //   generator: 'ruin',
  //   connections: {}
  // }
]
