import { Components } from './Components'
import * as C from './Components'

import { render } from '../Component/Render'

import { Point } from '../Model/Point'

export type EntityID = { readonly id: string }

export type Entity = EntityID & Components

export const templates: { [key: string]: (pt: Point, fov?: number) => Entity } = {
  door: (pt: Point) => {
    return {
      id: 'door',
      ...C.position(pt),
      ...render({
        base: { char: '+', color: 'saddlebrown' },
        seen: { color: 'saddlebrown' },
        baseDoorOpen: { char: '/' },
      }),
      ...C.description('door'),
      ...C.door(),
      ...C.trodOn('You carefully navigate through the door.'),
    }
  },

  player: (pt: Point, fov = 5) => {
    return {
      id: 'player',
      ...C.position(pt),
      ...render({ base: { char: '@', color: 'violet' } }),
      ...C.description('yourself'),
      ...C.tagPlayer(),
      ...C.tagActor(),
      ...C.fov(fov),
      ...C.seen(),
    }
  },

  orc: (pt: Point) => {
    return {
      id: 'orc',
      ...C.position(pt),
      ...render({ base: { char: 'Oo', color: 'green' } }),
      ...C.description('orc porkhoarder'),
      ...C.tagActor(),
    }
  },

  spider: (pt: Point) => {
    return {
      id: 'spider',
      ...C.position(pt),
      ...render({ base: { char: 'Ox', color: 'cyan' } }),

      ...C.description('tarantula'),
      ...C.tagActor(),
    }
  },

  snake: (pt: Point) => {
    return {
      id: 'snake',
      ...C.position(pt),
      ...render({ base: { char: 'Os', color: 'green' } }),

      ...C.description('taipan'),
      ...C.tagActor(),
    }
  },

  toad: (pt: Point) => {
    return {
      id: 'toad',
      ...C.position(pt),
      ...render({ base: { char: 'Ot', color: 'limegreen' } }),

      ...C.description('menacing toad'),
      ...C.tagActor(),
    }
  },

  crab: (pt: Point) => {
    return {
      id: 'crab',
      ...C.position(pt),
      ...render({ base: { char: 'Or', color: 'red' } }),

      ...C.description('doomcrab'),
      ...C.tagActor(),
    }
  },

  ghost: (pt: Point) => {
    return {
      id: 'ghost',
      ...C.position(pt),
      ...render({ base: { char: 'Og', color: 'white' } }),

      ...C.description('spectre'),
      ...C.tagActor(),
    }
  },

  demon: (pt: Point) => {
    return {
      id: 'demon',
      ...C.position(pt),
      ...render({ base: { char: 'OD', color: 'red' } }),

      ...C.description('SATAN'),
      ...C.tagActor(),
    }
  },

  hammerhead: (pt: Point) => {
    return {
      id: 'hammerhead',
      ...C.position(pt),
      ...render({ base: { char: 'OH', color: 'orange' } }),

      ...C.description('hammerhead shark man'),
      ...C.tagActor(),
    }
  },

  skeleton: (pt: Point) => {
    return {
      id: 'skeleton',
      ...C.position(pt),
      ...render({ base: { char: 'OS', color: 'white' } }),

      ...C.description('skellybones'),
      ...C.tagActor(),
    }
  },

  chicken: (pt: Point) => {
    return {
      id: 'chicken',
      ...C.position(pt),
      ...render({ base: { char: 'Oc', color: 'white' } }),
      ...C.description('lil chickadee'),
      ...C.tagActor(),
    }
  },

  bat: (pt: Point) => {
    return {
      id: 'bat',
      ...C.position(pt),
      ...render({ base: { char: 'Oa', color: 'red' } }),
      ...C.description('bat of hell'),
      ...C.tagActor(),
    }
  },

  karl: (pt: Point) => {
    return {
      id: 'karl',
      ...C.position(pt),
      ...render({ base: { char: 'K', color: 'yellow' } }),
      ...C.description('Karl'),
      ...C.tagActor(),
    }
  },
}
