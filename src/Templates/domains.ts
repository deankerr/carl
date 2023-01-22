// define domains

export const domains = [
  {
    label: 'overworld',
    seen: true,
    revealed: true,
    playerFOV: 12,
    generator: 'overworld',
    connections: {
      top: '',
      ascend: 'overworld',
      descend: 'overworld',
      bottom: '',
    },
  },
  // {
  //   label: 'outdoor',
  //   revealed: true,
  //   playerFOV: 12,
  //   generator: 'outdoor',
  //   connections: {
  //     // ascend: 'ruin'
  //     descend: 'dungeon',
  //   },
  // },

  // {
  //   label: 'dungeon',
  //   revealed: false,
  //   playerFOV: 7,
  //   generator: 'dungeon4',
  //   connections: {
  //     top: 'outdoor',
  //     ascend: 'dungeon',
  //     descend: 'dungeon',
  //     // bottom: 5 specify dungeon depth?
  //   },
  // },
  // {
  //   label: 'testLevel',
  //   revealed: true,
  //   playerFOV: 12,
  //   generator: 'testLevel',
  //   connections: {
  //     descend: 'dungeon',
  //   },
  // },

  // ruin: {
  //   revealed: false,
  //   playerFOV: 8,
  //   generator: 'ruin',
  //   connections: {}
  // }
]
