import { EntityKey } from '../../../Core'
import { ConstraintKey } from './Constraints'

type Variable = {
  keys: (EntityKey | EntityKey[])[]
  map: string[][]
  constraints: ConstraintKey[]
}

export type VariableKey = keyof typeof Variables

export const Variables = {
  // * decoration
  cornerCandle: {
    keys: [['candles', 'candlesNE', 'candlesSE']],
    map: [['0']],
    constraints: ['empty', 'walkable', 'corner'],
  },

  cornerWebNorthWest: {
    keys: ['webNW'],
    map: [['0']],
    constraints: ['empty', 'walkable', 'cornerNorthWest'],
  },

  cornerWebNorthEast: {
    keys: [['webNE']],
    map: [['0']],
    constraints: ['empty', 'walkable', 'cornerNorthEast'],
  },

  cornerWebSouthEast: {
    keys: [['webSE']],
    map: [['0']],
    constraints: ['empty', 'walkable', 'cornerSouthEast'],
  },

  cornerWebSouthWest: {
    keys: [['webSW']],
    map: [['0']],
    constraints: ['empty', 'walkable', 'cornerSouthWest'],
  },

  mushroom: {
    keys: [['redMushrooms', 'purpleMushrooms', 'yellowMushrooms']],
    map: [['0']],
    constraints: ['empty', 'walkable'],
  },

  sconce: {
    keys: [['sconce']],
    map: [['0']],
    constraints: ['empty', 'wall', 'top', 'exposed'],
  },

  smallSludgePond: {
    keys: ['sludge'],
    map: [['    '], [' 00 '], [' 00 '], ['    ']],
    constraints: ['empty', 'walkable'],
  },

  smallWaterPond: {
    keys: ['water'],
    map: [['    '], [' 00 '], [' 00 '], ['    ']],
    constraints: ['empty', 'walkable'],
  },

  // * blocking decoration
  statue: {
    keys: [['statueDragon', 'statueMonster', 'statueWarrior']],
    map: [['   '], [' 0 '], ['   ']],
    constraints: ['empty', 'walkable'],
  },

  statueAltar: {
    keys: [['carpet'], ['statueDragon'], ['dungeonWall']],
    map: [
      ['      ', '      '],
      [' 0000 ', ' 1  1 '],
      [' 0  0 ', '  22  '],
      [' 0  0 ', '  22  '],
      [' 0000 ', ' 1  1 '],
      ['      ', '      '],
    ],
    constraints: ['empty', 'walkable'],
  },

  smallDirtPitPlatformItem: {
    keys: [
      ['dirtFloorPit'],
      ['abyss'],
      ['skullBook', 'blueOrb', 'goldSkull', 'goldKey', 'pinkGem'],
    ],
    map: [['       '], [' 00000 '], [' 1  21 '], [' 10001 '], ['       ']],
    constraints: ['empty', 'walkable'],
  },

  smallStonePitPlatformItem: {
    keys: [
      ['stoneFloorPit'],
      ['abyss'],
      ['skullBook', 'blueOrb', 'goldSkull', 'goldKey', 'pinkGem'],
    ],
    map: [['       '], [' 00000 '], [' 1  21 '], [' 10001 '], ['       ']],
    constraints: ['empty', 'walkable'],
  },

  // * npcs
  goblinPackWeak: {
    keys: ['goblinSword', 'goblinSpear'],
    map: [['01'], ['10']],
    constraints: ['walkable'],
  },

  goblinPackStrong: {
    keys: ['goblinSword', 'goblinSpear', 'goblinShaman', 'bigGoblin'],
    map: [['01'], ['23']],
    constraints: ['walkable'],
  },

  skeletonPackWeak: {
    keys: ['skeleton', 'skeletonWarrior'],
    map: [['01'], ['00']],
    constraints: ['walkable'],
  },

  skeletonPackStrong: {
    keys: ['skeleton', 'skeletonWarrior'],
    map: [['01'], ['00']],
    constraints: ['walkable'],
  },

  spiderPack: {
    keys: ['spider'],
    map: [['00'], ['00']],
    constraints: ['walkable'],
  },

  gelCube: {
    keys: ['gelCube'],
    map: [['0']],
    constraints: ['walkable'],
  },

  beholder: {
    keys: ['beholder'],
    map: [['0']],
    constraints: ['walkable'],
  },
} satisfies Record<string, Variable>
