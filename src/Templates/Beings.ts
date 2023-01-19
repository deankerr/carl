import * as C from '../Component'
import { Entity } from '../Core/Entity'
import { Point } from '../Model/Point'

export type BeingTemplate = typeof Beings[keyof typeof Beings]

export const createBeing = (t: BeingTemplate, pt: Point, fov = 5): Entity => {
  const entity = {
    ...t,
    ...C.position(pt),
    ...C.tagActor(),
  }

  if (entity.id === 'player') {
    return { ...entity, ...C.tagPlayer(), ...C.fov(fov) }
  }
  return entity
}

export const Beings = {
  player: {
    id: 'player',
    name: 'me',
    char: '@',
    color: 'violet',
  },
  // beasts
  spider: {
    id: 'spider',
    name: 'tarantula',
    char: 'spider',
    color: '#00b3b3',
  },
  snake: {
    id: 'snake',
    name: 'taipan',
    char: 'snake',
    color: '#32cd32',
  },
  toad: {
    id: 'toad',
    name: 'cane toad menace',
    char: 'frog',
    color: '#32cd32',
  },
  crab: {
    id: 'crab',
    name: 'crab',
    char: 'crab',
    color: '#cc3131',
  },
  crab2: {
    id: 'crab2',
    name: 'turncoat crab',
    char: 'crab',
    color: '#cc3131',
  },
  chicken: {
    id: 'chicken',
    name: 'lil chickadee',
    char: 'chicken',
    color: '#dadada',
  },
  bat: {
    id: 'bat',
    name: 'megabat',
    char: 'bat',
    color: '#751d1c',
  },
  rat: {
    id: 'rat',
    name: 'rat prince',
    char: 'R',
    color: '#458727',
  },
  // spooks
  ghost: {
    id: 'ghost',
    name: 'wailing spirit',
    char: 'ghost',
    color: 'white',
  },
  demon: {
    id: 'demon',
    name: 'Natas, the mysterious wanderer',
    char: 'demon',
    color: 'red',
  },
  skeleton: {
    id: 'skeleton',
    name: 'skellybones',
    char: 'bones',
    color: 'white',
  },
  blob: {
    id: 'blob',
    name: 'polyp henchmen',
    char: 'blob',
    color: 'seagreen',
  },
  blob2: {
    id: 'blobAssassin',
    name: 'polyp assassin',
    char: 'blob',
    color: 'lightsalmon',
  },
  blob3: {
    id: 'blobKing',
    name: 'polyp mastermind',
    char: 'blob',
    color: 'magenta',
  },
  eye: {
    id: 'eye',
    name: 'eye of sight crime',
    char: 'E',
    color: 'lime',
  },
  zombie: {
    id: 'zombie',
    name: 'zombie',
    char: 'Z',
    color: 'maroon',
  },
  redJelly: {
    id: 'redJelly',
    name: 'strawberry jelly',
    char: 'j',
    color: 'red',
  },
  greenJelly: {
    id: 'greenJelly',
    name: 'cucumber jelly',
    char: 'j',
    color: 'green',
  },
  whiteJelly: {
    id: 'whiteJelly',
    name: 'milk jelly',
    char: 'j',
    color: 'silver',
  },
  yellowJelly: {
    id: 'yellowJelly',
    name: 'cheese jelly',
    char: 'j',
    color: 'yellow',
  },
  // intelligent
  orc: {
    id: 'orc',
    name: 'orc porkhoarder',
    char: 'O',
    color: 'green',
  },
  orc2: {
    id: 'orc2',
    name: 'orc forkstalker',
    char: 'O',
    color: 'purple',
  },
  orc3: {
    id: 'orc3',
    name: 'orc portworker',
    char: 'O',
    color: 'goldenrod',
  },
  orc4: {
    id: 'orc4',
    name: 'orc curdchurner',
    char: 'O',
    color: 'olive',
  },
  karl: {
    id: 'karl',
    name: 'Karl The Clown',
    char: 'K',
    color: 'yellow',
  },
  giant: {
    id: 'giant',
    name: 'giant bloke',
    char: 'G',
    color: '#d07554',
  },
  interest: {
    id: 'interest',
    name: 'compound interest',
    char: '%',
    color: 'peru',
  },
}
