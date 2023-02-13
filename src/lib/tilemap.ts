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
      'dungeonHorizontal1',
      'dungeonHorizontal2',
      'dungeonHorizontal3',
      'dungeonHorizontal4',
      'dungeonHorizontal5',
      'dungeonHorizontal6',
      'dungeonVertical1',
      'dungeonVertical2',
      'dungeonVertical3',
      'dungeonVertical4',
      'dungeonVertical5',
      'dungeonVertical6',
    ],
    [
      'caveHorizontal1',
      'caveHorizontal2',
      'caveHorizontal3',
      'caveHorizontal4',
      'caveHorizontal5',
      'caveHorizontal6',
      'caveVertical1',
      'caveVertical2',
      'caveVertical3',
      'caveVertical4',
      'caveVertical5',
      'caveVertical6',
    ],
    [
      'cryptHorizontal1',
      'cryptHorizontal2',
      'cryptHorizontal3',
      'cryptHorizontal4',
      'cryptHorizontal5',
      'cryptHorizontal6',
      'cryptVertical1',
      'cryptVertical2',
      'cryptVertical3',
      'cryptVertical4',
      'cryptVertical5',
      'cryptVertical6',
    ],
    [
      'cavernHorizontal1',
      'cavernHorizontal2',
      'cavernHorizontal3',
      'cavernHorizontal4',
      'cavernHorizontal5',
      'cavernHorizontal6',
      'cavernVertical1',
      'cavernVertical2',
      'cavernVertical3',
      'cavernVertical4',
      'cavernVertical5',
      'cavernVertical6',
    ],
    [
      'stoneFloor1',
      'stoneFloor2',
      'stoneFloor3',
      'stoneFloor4',
      'stoneFloor5',
      'stoneFloor6',
      'stoneFloorHole',
    ],
    [
      'dirtFloor1',
      'dirtFloor2',
      'dirtFloor3',
      'dirtFloor4',
      'dirtFloor5',
      'dirtFloor6',
      'dirtFloorHole',
      'dirtFloorHoleLedge',
    ],
    [
      'unknown',
      'stoneTileFloor1',
      'stoneTileFloor2',
      'stoneTileFloor3',
      'stoneTileFloor4',
      'stoneTileFloor5',
      'beigeTileFloor1',
      'beigeTileFloor2',
      'beigeTileFloor3',
      'beigeTileFloor4',
      'beigeTileFloor5',
      'carpet1',
      'carpet2',
      'carpet3',
      'carpetEmblem1',
      'carpetEmblem2',
    ],
    [
      'nothing',
      'dirtTileFloor1',
      'dirtTileFloor2',
      'dirtTileFloor3',
      'dirtTileFloor4',
      'dirtTileFloor5',
      'stonePebbleFloor1',
      'stonePebbleFloor2',
      'stonePebbleFloor3',
      'stonePebbleFloor4',
      'stonePebbleFloor5',
      'mossTileFloor1',
      'mossTileFloor2',
      'mossTileFloor3',
      'mossTileFloor4',
      'mossTileFloor5',
    ],
    [
      'waterClearLedge',
      'waterClear',
      'waterLedge1',
      'waterLedge2',
      'water1',
      'water2',
      'slimeClearLedge',
      'slimeClear',
      'slimeLedge1',
      'slimeLedge2',
      'slime1',
      'slime2',
      'oilLedge1',
      'oilLedge2',
      'oil1',
      'oil2',
    ],
    [
      'acidClearLedge',
      'acidClear',
      'acidLedge1',
      'acidLedge2',
      'acid1',
      'acid2',
      'bloodClearLedge',
      'bloodClear',
      'bloodLedge1',
      'bloodLedge2',
      'blood1',
      'blood2',
      'sludgeLedge1',
      'sludgeLedge2',
      'sludge1',
      'sludge2',
    ],
    [
      'woodenDoorClosed',
      'woodenDoorOpen',
      'woodenDoorVerticalClosed',
      'woodenDoorVerticalClosedTop',
      'woodenDoorVerticalOpenTop',
      'woodenDoorVerticalOpen',
      'jailDoorClosed',
      'jailDoorOpen',
      'jailDoorVerticalClosed',
      'jailDoorVerticalClosedTop',
      'jailDoorVerticalOpenTop',
      'jailDoorVerticalOpen',
    ],
    [
      'stoneDoorClosed',
      'stoneDoorOpen',
      'stoneDoorVerticalClosed',
      'stoneDoorVerticalClosedTop',
      'stoneDoorVerticalOpenTop',
      'stoneDoorVerticalOpen',
      'redDoorClosed',
      'redDoorOpen',
      'redDoorVerticalClosed',
      'redDoorVerticalClosedTop',
      'redDoorVerticalOpenTop',
      'redDoorVerticalOpen',
    ],
    ['crate', 'brokenCrate', 'chest', 'openChestFull', 'openChestEmpty', 'sconce1', 'sconce2'],
    ['webNW', 'webNE', 'webSW', 'webSE', 'web'],
    [
      'grassTuft1',
      'grassTuft2',
      'grassTuft3',
      'grassTuft4',
      'grassTuft5',
      'redMushrooms',
      'purpleMushrooms',
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
    ['grassTuft1Cut'],
    [
      'bWindow1',
      'bDoor',
      'bDoorOpen',
      'bRoofFront1',
      'bRoofFront2',
      'bRoof1',
      'bRoof2',
      'bRoofChimney',
      'signBlank',
      'signWeapon',
      'signPotion',
      'signInn',
      'bWindow2',
      'statueDragon',
      'statueWarrior',
      'statueMonster',
    ],
    [
      'bones1',
      'bones2',
      'bones3',
      'candles1',
      'candles2',
      'candlesSE1',
      'candlesSE2',
      'candlesNE1',
      'candlesNE2',
      'cauldron1',
      'cauldron2',
      'pots1',
      'pots2',
      'pot',
    ],
    ['web1', 'web2', 'sand', 'sandLedge', 'cactus'],
    [],
    [],
    [],
    ['warrior'],
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
    [],
    [],
    [],
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'A', 'B', 'C', 'D', 'E', 'F'],
    ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'],
    ['W', 'X', 'Y', 'Z', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-'],
    [
      '=',
      '+',
      '.',
      ',',
      ':',
      ';',
      '"',
      '<',
      '>',
      '?',
      '\\',
      '/',
      '|',
      'mdash',
      'note',
      'smile',
      'sad',
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

// export function tileVariant(k: EntityKey): EntityKey {
//   if (k === 'dungeonSolid') {
//     return rnd(16)
//       ? pick(['dungeonSolid1', 'dungeonSolid2', 'dungeonSolid3', 'dungeonSolid4'])
//       : pick(['dungeonSolid5', 'dungeonSolid6'])
//   }

//   if (k === 'caveSolid') {
//     return rnd(16)
//       ? pick(['caveSolid1', 'caveSolid2', 'caveSolid3', 'caveSolid4'])
//       : pick(['caveSolid5', 'caveSolid6'])
//   }

//   if (k === 'pitSolid') {
//     return rnd(16)
//       ? pick(['pitSolid1', 'pitSolid2', 'pitSolid3', 'pitSolid4'])
//       : pick(['pitSolid5', 'pitSolid6'])
//   }

//   if (k === 'caveWall') {
//     return rnd(3)
//       ? 'caveWall1'
//       : pick(['caveWall1', 'caveWall2', 'caveWall3', 'caveWall4', 'caveWall5', 'caveWall6'])
//   }

//   if (k === 'stoneFloor') {
//     return rnd(3)
//       ? 'stoneFloor1'
//       : pick([
//           'stoneFloor1',
//           'stoneFloor2',
//           'stoneFloor3',
//           'stoneFloor4',
//           'stoneFloor5',
//           'stoneFloor6',
//         ])
//   }

//   if (k === 'dirtFloor') {
//     return rnd(3)
//       ? 'dirtFloor1'
//       : pick(['dirtFloor1', 'dirtFloor2', 'dirtFloor3', 'dirtFloor4', 'dirtFloor5', 'dirtFloor6'])
//   }

//   return k
// }
