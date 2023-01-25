export type BeingTemplate = typeof Beings[keyof typeof Beings]

export const Beings = {
  player: {
    id: 'player',
    name: 'me',
    char: '@',
    color: 'violet',
    tag: ['actor', 'player'],
    fov: 8, //[8, 12], // indoor/outdoor
  },
  // beasts
  spider: {
    id: 'spider',
    name: 'tarantula',
    char: 'spider',
    color: '#00b3b3',
    tag: ['actor'],
  },
  snake: {
    id: 'snake',
    name: 'taipan',
    char: 'snake',
    color: '#32cd32',
    tag: ['actor'],
  },
  toad: {
    id: 'toad',
    name: 'toad menace',
    char: 'frog',
    color: '#32cd32',
    tag: ['actor'],
  },
  crab: {
    id: 'crab',
    name: 'crab',
    char: 'crab',
    color: '#cc3131',
    tag: ['actor'],
  },
  crab2: {
    id: 'crab2',
    name: 'turncoat crab',
    char: 'crab',
    color: '#32cd44',
    tag: ['actor'],
  },
  chicken: {
    id: 'chicken',
    name: 'lil chickadee',
    char: 'chicken',
    color: '#dadada',
    tag: ['actor'],
  },
  bat: {
    id: 'bat',
    name: 'megabat',
    char: 'bat',
    color: '#751d1c',
    tag: ['actor'],
  },
  rat: {
    id: 'rat',
    name: 'rat prince',
    char: 'R',
    color: '#458727',
    tag: ['actor'],
  },
  // spooks
  ghost: {
    id: 'ghost',
    name: 'wailing spirit',
    char: 'ghost',
    color: 'white',
    tag: ['actor'],
  },
  demon: {
    id: 'demon',
    name: 'Natas, the mysterious wanderer',
    char: 'demon',
    color: 'red',
    tag: ['actor'],
  },
  skeleton: {
    id: 'skeleton',
    name: 'skellybones',
    char: 'bones',
    color: 'white',
    tag: ['actor'],
  },
  blob: {
    id: 'blob',
    name: 'polyp henchmen',
    char: 'blob',
    color: 'seagreen',
    tag: ['actor'],
  },
  blob2: {
    id: 'blobAssassin',
    name: 'polyp assassin',
    char: 'blob',
    color: 'lightsalmon',
    tag: ['actor'],
  },
  blob3: {
    id: 'blobKing',
    name: 'polyp mastermind',
    char: 'blob',
    color: 'magenta',
    tag: ['actor'],
  },
  eye: {
    id: 'eye',
    name: 'eye of sight crime',
    char: 'E',
    color: 'lime',
    tag: ['actor'],
  },
  zombie: {
    id: 'zombie',
    name: 'zombie',
    char: 'Z',
    color: 'maroon',
    tag: ['actor'],
  },
  redJelly: {
    id: 'redJelly',
    name: 'strawberry jelly',
    char: 'j',
    color: 'red',
    tag: ['actor'],
  },
  greenJelly: {
    id: 'greenJelly',
    name: 'cucumber jelly',
    char: 'j',
    color: 'green',
    tag: ['actor'],
  },
  whiteJelly: {
    id: 'whiteJelly',
    name: 'milk jelly',
    char: 'j',
    color: 'silver',
    tag: ['actor'],
  },
  yellowJelly: {
    id: 'yellowJelly',
    name: 'cheese jelly',
    char: 'j',
    color: 'yellow',
    tag: ['actor'],
  },
  // intelligent
  orc: {
    id: 'orc',
    name: 'orc porkhoarder',
    char: 'O',
    color: 'green',
    tag: ['actor'],
  },
  orc2: {
    id: 'orc2',
    name: 'orc forkstalker',
    char: 'O',
    color: 'purple',
    tag: ['actor'],
  },
  orc3: {
    id: 'orc3',
    name: 'orc portworker',
    char: 'O',
    color: 'goldenrod',
    tag: ['actor'],
  },
  orc4: {
    id: 'orc4',
    name: 'orc curdchurner',
    char: 'O',
    color: 'olive',
    tag: ['actor'],
  },
  karl: {
    id: 'karl',
    name: 'Karl The Clown',
    char: 'K',
    color: 'yellow',
    tag: ['actor'],
  },
  giant: {
    id: 'giant',
    name: 'giant bloke',
    char: 'G',
    color: '#d07554',
    tag: ['actor'],
  },
  interest: {
    id: 'interest',
    name: 'compound interest',
    char: '%',
    color: 'peru',
    tag: ['actor'],
  },
}
