import { EntityKey } from '../Core'
import { pick, rnd } from './util'

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const punctuation = '!@#$%^&*()-=+.,:;"<>?\\/|-:'
const numbers = '1234567890'

// get a range of tiles in the ROT format
const mapRange = (
  chars: string,
  y: number,
  tileSize: number
): { [key: string]: [number, number] } => {
  return chars.split('').reduce((acc, curr, i) => {
    return (acc = { ...acc, [curr]: [tileSize * i, tileSize * y] })
  }, {})
}

const mapChar = (x: number, y: number, tileSize: number): [number, number] => {
  return [x * tileSize, y * tileSize]
}

const t = 32 // main tileset size
export const tileMapOryxMain = {
  ...mapRange(letters, 6, t),
  ...mapRange(letters.toLocaleLowerCase(), 6, t),
  ...mapRange(numbers, 7, t),
  ...mapRange(punctuation, 5, t),
  "'": mapChar(27, 3, t),
  ' ': mapChar(27, 0, t),
  bat: mapChar(21, 3, t),
  bigCheck: mapChar(21, 7, t),
  bigMozzie1: mapChar(23, 3, t),
  bigMozzie2: mapChar(24, 3, t),
  blob: mapChar(16, 3, t),
  bones: mapChar(5, 3, t),
  brick: mapChar(26, 8, t),
  bugman: mapChar(12, 3, t),
  cactus: mapChar(13, 0, t),
  caveWall: mapChar(25, 8, t),
  chicken: mapChar(18, 3, t),
  column: mapChar(19, 4, t),
  crab: mapChar(10, 3, t),
  crackedPath1: mapChar(9, 2, t),
  crackedPath2: mapChar(10, 2, t),
  crackedPath3: mapChar(11, 2, t),
  crackedPath4: mapChar(12, 2, t),
  crackedWall: mapChar(1, 2, t),
  deadGrass: mapChar(1, 0, t),
  demon: mapChar(4, 3, t),
  doorClosed: mapChar(13, 2, t),
  doorOpen: mapChar(14, 2, t),
  flames1: mapChar(4, 1, t),
  flames2: mapChar(5, 1, t),
  frog: mapChar(19, 3, t),
  ghost: mapChar(22, 3, t),
  grass: mapChar(0, 0, t),
  hammerheadman: mapChar(11, 3, t),
  heavyDoorClosed: mapChar(15, 2, t),
  heavyDoorOpen: mapChar(16, 2, t),
  hollowBox: mapChar(24, 7, t),
  mound: mapChar(7, 0, t),
  mozzie1: mapChar(2, 8, t),
  mozzie2: mapChar(3, 8, t),
  nest: mapChar(9, 0, t),
  path: mapChar(8, 2, t),
  peak: mapChar(4, 0, t),
  pip: mapChar(22, 7, t),
  sand: mapChar(27, 9, t),
  scorpion1: mapChar(0, 8, t),
  scorpion2: mapChar(1, 8, t),
  shrub: mapChar(2, 0, t),
  smallCheck: mapChar(20, 7, t),
  snake: mapChar(8, 3, t),
  solid: mapChar(27, 8, t),
  spider: mapChar(6, 3, t),
  stairsDown: mapChar(18, 2, t),
  stairsUp: mapChar(17, 2, t),
  stalk: mapChar(12, 0, t),
  statue: mapChar(19, 2, t),
  tick1: mapChar(25, 3, t),
  tick2: mapChar(26, 3, t),
  tombstone: mapChar(22, 2, t),
  tree: mapChar(5, 0, t),
  void: mapChar(13, 0, t),
  wall: mapChar(0, 2, t),
  water1: mapChar(0, 1, t),
  water2: mapChar(1, 1, t),
  web: mapChar(24, 8, t),
} satisfies { [key: string]: [number, number] }

export function oryxTinyMap(size: number) {
  const tiles = [
    [
      'dungeonWall1',
      'dungeonWall2',
      'dungeonWall3',
      'dungeonWall4',
      'dungeonWall5',
      'dungeonWall6',
      'dungeonSolid1',
      'dungeonSolid2',
      'dungeonSolid3',
      'dungeonSolid4',
      'dungeonSolid5',
      'dungeonSolid6',
    ],
    [
      'caveWall1',
      'caveWall2',
      'caveWall3',
      'caveWall4',
      'caveWall5',
      'caveWall6',
      'caveSolid1',
      'caveSolid2',
      'caveSolid3',
      'caveSolid4',
      'caveSolid5',
      'caveSolid6',
    ],
    ['tombWall'],
    ['pitWall1'],
    ['stoneFloor1'],
    ['dirtFloor1', 'dirtFloor2', 'dirtFloor3', 'dirtFloor4', 'dirtFloor5', 'dirtFloor6'],
    ['unknown'],
    ['nothing'],
    ['waterFaceClear', 'waterClear', 'waterFace1', 'waterFace2', 'water1', 'water2'],
    ['acidFaceClear'],
    ['woodenDoorClosed'],
    ['stoneDoorClosed'],
    ['crate'],
    ['webNW', 'webNE', 'webSW', 'webSE', 'web'],
    [
      'clover4',
      'clover31',
      'clover32',
      'clover33',
      'clover34',
      'redMushrooms',
      'magentaMushrooms',
      'yellowMushrooms',
      'lilypad11',
      'lilypad21',
      'lilypad31',
      'lilypad41',
      'lilypad12',
      'lilypad22',
      'lilypad32',
      'lilypad42',
    ],
    ['bookshelf'],
    ['um'],
    ['bWindow'],
    ['bones'],
    ['web1', 'web2', 'sand', 'sandFace', 'cactus'],
    [],
    [],
    [],
    ['@'],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [
      'spiderRed1',
      'spiderRed2',
      'spiderBlack1',
      'spiderBlack2',
      'scorpionRed1',
      'scorpionRed2',
      'scorpionBlack1',
      'scorpionBlack2',
    ],
  ]

  return tiles.reduce((acc, curr, y) => {
    const row = curr.reduce((rAcc, rCurr, x) => {
      const tile = { [rCurr]: [x * size, y * size] } as Record<string, [number, number]>
      return { ...rAcc, ...tile }
    }, {} as Record<string, [number, number]>)

    return { ...acc, ...row }
  }, {} as Record<string, [number, number]>)
}

export function tileVariant(k: EntityKey): EntityKey {
  if (k === 'caveSolid') {
    return rnd(16)
      ? pick(['caveSolid1', 'caveSolid2', 'caveSolid3', 'caveSolid4'])
      : pick(['caveSolid5', 'caveSolid6'])
  }

  if (k === 'caveWall') {
    return rnd(3)
      ? 'caveWall1'
      : pick(['caveWall1', 'caveWall2', 'caveWall3', 'caveWall4', 'caveWall5', 'caveWall6'])
  }

  if (k === 'dirtFloor') {
    return rnd(3)
      ? 'dirtFloor1'
      : pick(['dirtFloor1', 'dirtFloor2', 'dirtFloor3', 'dirtFloor4', 'dirtFloor5', 'dirtFloor6'])
  }

  return k
}
