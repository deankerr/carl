import { Components } from './Components'
import * as C from '../Component'
import { Point } from '../Model/Point'
import { transformHSL } from '../lib/color'
import { graphic } from '../Component'

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
    ...C.baseGraphic('@', 'violet'),
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
    ...C.baseGraphic('O+', '#73513d'),
    ...C.description('door'),
    ...C.tagDoor(),
    ...C.doorGraphic(graphic('O+', '#73513d'), graphic('O/', '#73513d')),
    // ...C.trodOn('You carefully navigate through the door.'),
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
    ...C.baseGraphic(t[1], t[2]),
    ...C.position(pt),
    ...C.tagActor(),
  }

  return entity
}

// [name, char, color, trod, walkable, memorable]
export const features = {
  shrub: ['shrub', 'Ov', '#58a54a', 'You trample the pathetic shrub', 'true', 'true'],
  flames: ['flames', '', '#fc7703'],
  flamesBlue: ['blue flames', 'blue', '#141cff'],
  flamesGreen: ['green flames', 'green', '#0df20d'],
}

const flames = (color: string, pt: Point) => {
  let color1 = '#fc7703'
  let color2 = transformHSL(color1, 0.6, 0)
  switch (color) {
    case 'blue':
      color1 = features.flamesBlue[2]
      color2 = transformHSL(color1, 0.5, 0)
      break
    case 'green':
      color1 = '#0df20d'
      color2 = transformHSL(color1, 0.6, 0)
      break
  }

  return {
    id: 'flames',
    ...C.description('flames'),
    ...C.baseGraphic('flame1', color1),
    ...C.position(pt),
    ...C.trodOn('You begin to crisp up nicely while standing in the flames'),
    ...C.tagWalkable(),
    ...C.tagMemorable(),
    ...C.cycleGraphic([
      { char: 'flame1', color: color1 },
      { char: 'flame2', color: color2 },
    ]),
    ...C.emitLight(color1),
  }
}

export const hydrateFeature = (t: FeatureTemplate, pt: Point) => {
  if (t[0].includes('flames')) return flames(t[1], pt)
  let entity = {
    id: t[0].replaceAll(' ', ''),
    ...C.description(t[0]),
    ...C.baseGraphic(t[1], t[2]),
    ...C.position(pt),
    ...C.trodOn(t[3]),
  }

  // TODO avoid this with better templating
  if (t[4] === 'true') {
    entity = { ...entity, ...C.tagWalkable() }
  }

  if (t[3] === 'true') {
    entity = { ...entity, ...C.tagMemorable() }
  }

  return entity
}

export const templates = { ...beings, ...features }
export type FeatureTemplate = typeof features[keyof typeof features]
