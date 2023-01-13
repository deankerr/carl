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
        base: { char: 'O+', color: 'saddlebrown' },
        seen: { color: 'saddlebrown' },
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
        base: { char: 'Ov', color: 'green' },
        seen: { color: 'darkgreen' },
      }),
      ...C.tagWalkable(),
      ...C.trodOn('You trample the pathetic shrub.'),
    }
  },
}
