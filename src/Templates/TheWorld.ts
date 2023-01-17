// Describe the world (how levels connect to each other)
import * as Generate from '../Generate'
import { Level } from '../Model/Level'

type Location = {
  label: string
  revealed: boolean
  playerFOV: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generator: (...args: any[]) => Generate.NewLevel // TODO standardize generator params
}

// defaults, inherit only
const base = {
  label: 'base',
  revealed: false,
  playerFOV: 8,
  generator: Generate.arena,
}

const outdoor: Location = {
  ...base,
  label: 'outdoor',
  revealed: true,
  playerFOV: 12,
  generator: Generate.outdoor,
}

const dungeon: Location = {
  ...base,
  label: 'dungeon',
  generator: Generate.dungeon4,
}

// not implemented, use a cell generator
const cave: Location = {
  ...base,
  label: 'cave',
  generator: Generate.arena,
}

// above outdoor ruin
const ruin: Location = {
  ...base,
  label: 'ruin',
  generator: Generate.prefabRuin1,
}

export const TheWorld = {
  outdoor: {
    ...outdoor, // level configs
    top: undefined,
    ascend: ruin, // up stairs lead to
    descend: dungeon, // down stairs lead to (choose using stair tag?)
    bottom: undefined,
    levels: [] as Level[], // store the level(s) here
    root: true, // start the game here
  },
  dungeon: {
    ...dungeon,
    top: outdoor, // the top of the dungeon (ie accessing -1 in the array) leads to
    ascend: dungeon,
    descend: dungeon,
    bottom: dungeon,
    levels: [] as Level[],
  },
  cave: {
    ...cave,
    top: outdoor,
    ascend: undefined,
    descend: undefined,
    bottom: undefined,
    levels: [] as Level[],
  },
  ruin: {
    ...ruin,
    top: undefined,
    ascend: undefined,
    descend: undefined,
    bottom: outdoor, // like top, but indicates an "ascending dungeon"
    levels: [] as Level[],
  },
}

export const RootOfTheWorld = 'outdoor' // start the game here

// THEWORLD['root'].
// type Locations = keyof typeof THEWORLD

// THEWORLD['outdoor']

// const worlddef2 = {
//   outdoor: [
//     { dungeon: [dungeon] },
//     { cave: null },
//     { ruin: null }
//   ]

//  }

// const locations = {
//   outdoor:  {
//     ...base,
//     revealed: true,
//     playerFOV: 12,
//     generator: Generate.outdoor,
//   },

//    dungeon:  {
//     ...base,
//     generator: Generate.dungeon4,
//   },

//   // not implemented, use a cell generator
//    cave:  {
//     ...base,
//     generator: Generate.arena,
//   },

//   // above outdoor ruin
//    ruin:  {
//     ...base,
//     generator: Generate.prefabRuin1,
//   }
// }
