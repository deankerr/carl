import { Components } from './Components'
import * as C from '../Component'
import { Point } from '../Model/Point'

export type EntityID = { readonly id: string }

export type Entity = EntityID & Components

export type EntityTemplates = {
  player?: Point
  beings: [BeingTemplate, Point | 0][]
  features: [FeatureTemplate, Point | 0][]
  doors: Point[]
}

export const createTemplates = (): EntityTemplates => {
  return { beings: [], features: [], doors: [] }
}

export const createPlayer = (pt: Point, fov = 4) => {
  return {
    id: 'player',
    ...C.position(pt),
    ...C.render({ base: { char: '@', color: 'violet' } }),
    ...C.description('yourself'),
    ...C.tagPlayer(),
    ...C.tagActor(),
    ...C.fov(fov),
  }
}

// export type PlayerTemplate = ReturnType<typeof createPlayer>

export const createDoor = (pt: Point) => {
  return {
    id: 'door',
    ...C.position(pt),
    ...C.render({
      base: { char: 'O+', color: '#73513d' },
      baseDoorOpen: { char: 'O/' },
    }),
    ...C.description('door'),
    ...C.door(),
    ...C.trodOn('You carefully navigate through the door.'),
    ...C.tagBlocksLight(),
    ...C.tagMemorable(),
  }
}

// export type DoorTemplate = ReturnType<typeof createDoor>

// [name, char, color]
export const beings = {
  // beasts
  spider: ['tarantula', 'Ox', 'cyan'],
  snake: ['taipan', 'Os', 'green'],
  toad: ['menacing toad', 'Ot', 'limegreen'],
  crab: ['crab', 'Or', 'red'],
  crab2: ['turncoat crab', 'Or', 'green'],
  chicken: ['lil chickadee', 'Oc', 'white'],
  bat: ['bat of hell', 'Oa', 'red'],
  rat: ['boy rat', 'R', 'brown'],

  // spooks
  ghost: ['wailing spirit', 'Og', 'white'],
  demon: ['Natas, the mysterious wanderer', 'OD', 'red'],
  skeleton: ['skellybones', 'OS', 'white'],
  blob: ['polyp henchmen', 'blob', 'seagreen'],
  blobAssassin: ['polyp assassin', 'blob', 'lightsalmon'],
  blobKing: ['polyp mastermind', 'blob', 'magenta'],
  eye: ['eye of sight crime', 'E', 'lime'],
  zombie: ['zombie', 'Z', 'maroon'],
  redJelly: ['strawberry jelly', 'j', 'red'],
  greenJelly: ['cucumber jelly', 'j', 'green'],
  whiteJelly: ['milk jelly', 'j', 'silver'],
  yellowJelly: ['cheese jelly', 'j', 'yellow'],

  // intelligent
  orc: ['orc porkhoarder', 'O', 'green'],
  orc2: ['orc forkstalker', 'O', 'purple'],
  orc3: ['orc portworker', 'O', 'goldenrod'],
  orc4: ['orc curdchurner', 'O', 'olive'],
  karl: ['Karl The Clown', 'K', 'yellow'],
  giant: ['giant bloke', 'G', 'orchid'],
  interest: ['compound interest', '%', 'peru'],
}

export type BeingTemplate = typeof beings[keyof typeof beings]

export const hydrateBeing = (t: BeingTemplate, pt: Point) => {
  const entity = {
    id: t[0].replaceAll(' ', ''),
    ...C.description(t[0]),
    ...C.render({ base: { char: t[1], color: t[2] } }),
    ...C.position(pt),
    ...C.tagActor(),
  }

  return entity
}

// [name, char, color, trod, walkable]
export const features = {
  shrub: ['shrub', 'Ov', '#58a54a', 'You trample the pathetic shrub', 'true'],
}

export const hydrateFeature = (t: FeatureTemplate, pt: Point) => {
  let entity = {
    id: t[0].replaceAll(' ', ''),
    ...C.description(t[0]),
    ...C.render({ base: { char: t[1], color: t[2] } }),
    ...C.position(pt),
    ...C.trodOn(t[3]),
    ...C.tagMemorable(),
  }

  if (t[4] === 'true') {
    entity = { ...entity, ...C.tagWalkable() }
  }
  return entity
}

export const templates = { ...beings, ...features }
export type FeatureTemplate = typeof features[keyof typeof features]

export const colorName = (entity: Entity) => {
  const name = entity.description?.name ?? 'MISSINGNAME'
  const color = entity.render?.base.color ?? 'red'
  return `%c{${color}}${name}%c{}`
}
