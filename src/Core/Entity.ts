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
}

// [name, char, color]
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
  blobAssassin: ['polyp assassin', 'blob', 'lightsalmon'],
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
  giant: ['giant', 'G', 'orchid'],
  interest: ['compound interest', '%', 'peru'],
} as const

export const hydrateBeing = (key: keyof typeof beings, pt: Point) => {
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

// [name, char, color, trod, walkable]
export const decor = {
  shrub: ['shrub', 'Ov', '#58a54a', '#407936', 'You trample the pathetic shrub', 'true'],
} as const

export const hydrateDecor = <K extends keyof typeof decor>(key: K, pt: Point) => {
  const t = decor[key]
  let entity = {
    id: key,
    ...C.description(t[0]),
    ...C.render({ base: { char: t[1], color: t[2] }, seen: { color: t[3] } }),
    ...C.position(pt),
    ...C.trodOn(t[4]),
  }

  if (t[5] === 'true') {
    entity = { ...entity, ...C.tagWalkable() }
  }
  return entity
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
