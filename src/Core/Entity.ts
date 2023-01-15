import { Components } from './Components'
import * as C from '../Component'
import { Point } from '../Model/Point'

export type EntityID = { readonly id: string }

export type Entity = EntityID & Components

export const templates = {
  door: (pt: Point) => {
    return {
      id: 'door',
      ...C.position(pt),
      ...C.render({
        base: { char: 'O+', color: '#73513d' },
        seen: { color: '#5b4030' },
        baseDoorOpen: { char: 'O/' },
      }),
      ...C.description('door'),
      ...C.door(),
      ...C.trodOn('You carefully navigate through the door.'),
      ...C.tagBlocksLight(),
    }
  },

  player: (pt: Point, fov = 10) => {
    return {
      id: 'player',
      ...C.position(pt),
      ...C.render({ base: { char: '@', color: 'violet' } }),
      ...C.description('yourself'),
      ...C.tagPlayer(),
      ...C.tagActor(),
      ...C.fov(fov),
    }
  },

  orc: (pt: Point) => {
    return {
      id: 'orc',
      ...C.position(pt),
      ...C.render({ base: { char: 'Oo', color: 'green' } }),
      ...C.description('orc porkhoarder'),
      ...C.tagActor(),
    }
  },

  spider: (pt: Point) => {
    return {
      id: 'spider',
      ...C.position(pt),
      ...C.render({ base: { char: 'Ox', color: 'cyan' } }),
      ...C.description('tarantula'),
      ...C.tagActor(),
    }
  },

  snake: (pt: Point) => {
    return {
      id: 'snake',
      ...C.position(pt),
      ...C.render({ base: { char: 'Os', color: 'green' } }),
      ...C.description('taipan'),
      ...C.tagActor(),
    }
  },

  toad: (pt: Point) => {
    return {
      id: 'toad',
      ...C.position(pt),
      ...C.render({ base: { char: 'Ot', color: 'limegreen' } }),
      ...C.description('menacing toad'),
      ...C.tagActor(),
    }
  },

  crab: (pt: Point) => {
    return {
      id: 'crab',
      ...C.position(pt),
      ...C.render({ base: { char: 'Or', color: 'red' } }),
      ...C.description('doomcrab'),
      ...C.tagActor(),
    }
  },

  ghost: (pt: Point) => {
    return {
      id: 'ghost',
      ...C.position(pt),
      ...C.render({ base: { char: 'Og', color: 'white' } }),
      ...C.description('spectre'),
      ...C.tagActor(),
    }
  },

  demon: (pt: Point) => {
    return {
      id: 'demon',
      ...C.position(pt),
      ...C.render({ base: { char: 'OD', color: 'red' } }),
      ...C.description('SATAN'),
      ...C.tagActor(),
    }
  },

  hammerhead: (pt: Point) => {
    return {
      id: 'hammerhead',
      ...C.position(pt),
      ...C.render({ base: { char: 'OH', color: 'orange' } }),
      ...C.description('hammerhead shark man'),
      ...C.tagActor(),
    }
  },

  skeleton: (pt: Point) => {
    return {
      id: 'skeleton',
      ...C.position(pt),
      ...C.render({ base: { char: 'OS', color: 'white' } }),
      ...C.description('skellybones'),
      ...C.tagActor(),
    }
  },

  chicken: (pt: Point) => {
    return {
      id: 'chicken',
      ...C.position(pt),
      ...C.render({ base: { char: 'Oc', color: 'white' } }),
      ...C.description('lil chickadee'),
      ...C.tagActor(),
    }
  },

  bat: (pt: Point) => {
    return {
      id: 'bat',
      ...C.position(pt),
      ...C.render({ base: { char: 'Oa', color: 'red' } }),
      ...C.description('bat of hell'),
      ...C.tagActor(),
    }
  },

  karl: (pt: Point) => {
    return {
      id: 'karl',
      ...C.position(pt),
      ...C.render({ base: { char: 'K', color: 'yellow' } }),
      ...C.description('Karl'),
      ...C.tagActor(),
    }
  },

  shrub: (pt: Point) => {
    return {
      id: 'shrub',
      ...C.position(pt),
      ...C.render({
        base: { char: 'Ov', color: '#58a54a' },
        seen: { color: '#407936' },
      }),
      ...C.tagWalkable(),
      ...C.trodOn('You trample the pathetic shrub.'),
    }
  },
}

// entity-key: description, char, color
export const beings = {
  // beasts
  spider: ['tarantula', 'Ox', 'cyan'],
  snake: ['taipan', 'Os', 'green'],
  toad: ['menacing toad', 'Ot', 'limegreen'],
  crab: ['turncoat crab', 'Or', 'red'],
  chicken: ['lil chickadee', 'Oc', 'white'],
  bat: ['bat of hell', 'Oa', 'red'],
  rat: ['boy rat', 'R', 'brown'],

  // spooks
  ghost: ['wailing spirit', 'Og', 'white'],
  demon: ['SATAN', 'OD', 'red'],
  skeleton: ['skellybones', 'OS', 'white'],
  blob: ['polyp henchmen', 'blob', 'seagreen'],
  blobKing: ['polyp mastermind', 'blob', 'magenta'],
  eye: ['eye of sight crime', 'E', 'lime'],
  zombie: ['zombie', 'Z', 'maroon'],
  redJelly: ['strawberry jelly', 'j', 'red'],
  greenJelly: ['cucumber jelly', 'j', 'green'],
  grapeJelly: ['grape jelly', 'j', 'purple'],
  bananaJelly: ['banana jelly', 'j', 'yellow'],

  // intelligent
  orc: ['orc porkhoarder', 'O', 'green'],
  karl: ['Karl', 'K', 'yellow'],
  gary: ['Gary', 'G', 'orchid'],
  interest: ['compound interest', '%', 'peru'],
} as const

export const hydrateBeing = <K extends keyof typeof beings>(key: K, pt: Point) => {
  // const a = being
  const template = beings[key]

  const entity = {
    id: key,
    ...C.description(template[0]),
    ...C.render({ base: { char: template[1], color: template[2] } }),
    ...C.position(pt),
    ...C.tagActor(),
  }

  return entity
}

// [desc, char, color, trod, walkable]
export const decor = {
  shrub: ['shrub', 'Ov', '#58a54a', '#407936', 'You trample the pathetic shrub', 'true'],
} as const

export const hydrateDecor = <K extends keyof typeof decor>(key: K, pt: Point) => {
  const t = decor[key]
  const entity = {
    id: key,
    ...C.description(t[0]),
    ...C.render({ base: { char: t[1], color: t[2] }, seen: { color: t[3] } }),
    ...C.position(pt),
    ...C.trodOn(t[4]),
  }

  return t[5] === 'true' ? { ...entity, ...C.tagWalkable() } : entity
}

export type Templates2 = keyof typeof beings | keyof typeof decor
// const beingSchema = [C.description, C.render, C.position, C.tagActor]

// const beingTemplates = { ...beasts, ...ghouls, ...beings }

// type bty<K extends keyof typeof beingTemplates, P> ={ typeof beingTemplates[K]: typeof beingTemplates[K][P]}

// const hydrate = <T, K extends keyof T>(being: K[T], pt: Point) => {
//   const e = {
//     id: ' bsrt',
//   }
// }
