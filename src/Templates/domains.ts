// define domains

// type DomainTemplate = {

//     label: string;
//     root?: true;
//     revealed: boolean;
//     playerFOV: number;
//     generator: string;
//   connections: {
//     top?: string
//     ascend?:
//         descend: string;
//     };

// }

export const domains = [
  {
    label: 'outdoor',
    revealed: true,
    playerFOV: 12,
    generator: 'outdoor',
    connections: {
      // ascend: 'ruin'
      descend: 'dungeon',
    },
  },

  {
    label: 'dungeon',
    revealed: false,
    playerFOV: 8,
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
