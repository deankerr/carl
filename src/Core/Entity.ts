import { Components } from './Components'
import * as C from './Components'
import { Point } from '../Model/Point'

export type EntityID = { readonly id: string }

export type Entity = EntityID & Components

export const templates: { [key: string]: (pt: Point, fov?: number) => Entity } = {
  door: (pt: Point) => {
    return {
      id: 'door',
      ...C.position(pt.x, pt.y),
      ...C.render('saddlebrown', '+', 'O^+'),
      ...C.renderSeenColor('#4d2509'),
      ...C.description('door'),
      ...C.door(),
      ...C.trodOn('You carefully navigate through the door.'),
    }
  },

  player: (pt: Point, fov = 5) => {
    return {
      id: 'player',
      ...C.position(pt.x, pt.y),
      ...C.render('white', '@'),
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
      ...C.position(pt.x, pt.y),
      ...C.render('green', 'o', 'O^o'),
      ...C.description('orc porkhoarder'),
      ...C.tagActor(),
    }
  },

  spider: (pt: Point) => {
    return {
      id: 'spider',
      ...C.position(pt.x, pt.y),
      ...C.render('cyan', 'x', 'O^x'),
      ...C.description('tarantula'),
      ...C.tagActor(),
    }
  },

  snake: (pt: Point) => {
    return {
      id: 'snake',
      ...C.position(pt.x, pt.y),
      ...C.render('lightgreen', 's', 'O^s'),
      ...C.description('taipan'),
      ...C.tagActor(),
    }
  },

  toad: (pt: Point) => {
    return {
      id: 'toad',
      ...C.position(pt.x, pt.y),
      ...C.render('limegreen', 't', 'O^t'),
      ...C.description('menacing toad'),
      ...C.tagActor(),
    }
  },

  crab: (pt: Point) => {
    return {
      id: 'crab',
      ...C.position(pt.x, pt.y),
      ...C.render('red', 'r', 'O^r'),
      ...C.description('doomcrab'),
      ...C.tagActor(),
    }
  },

  ghost: (pt: Point) => {
    return {
      id: 'ghost',
      ...C.position(pt.x, pt.y),
      ...C.render('white', 'g', 'O^g'),
      ...C.description('spectre'),
      ...C.tagActor(),
    }
  },

  demon: (pt: Point) => {
    return {
      id: 'demon',
      ...C.position(pt.x, pt.y),
      ...C.render('orangered', 'D', 'O^D'),
      ...C.description('SATAN'),
      ...C.tagActor(),
    }
  },

  hammerhead: (pt: Point) => {
    return {
      id: 'hammerhead',
      ...C.position(pt.x, pt.y),
      ...C.render('orange', 'H', 'O^H'),
      ...C.description('hammerhead shark man'),
      ...C.tagActor(),
    }
  },

  skeleton: (pt: Point) => {
    return {
      id: 'skeleton',
      ...C.position(pt.x, pt.y),
      ...C.render('white', 'S', 'O^S'),
      ...C.description('skellybones'),
      ...C.tagActor(),
    }
  },

  chicken: (pt: Point) => {
    return {
      id: 'chicken',
      ...C.position(pt.x, pt.y),
      ...C.render('grey', 'c', 'O^c'),
      ...C.description('lil chickadee'),
      ...C.tagActor(),
    }
  },

  bat: (pt: Point) => {
    return {
      id: 'bat',
      ...C.position(pt.x, pt.y),
      ...C.render('red', 'a', 'O^a'),
      ...C.description('bat of hell'),
      ...C.tagActor(),
    }
  },

  karl: (pt: Point) => {
    return {
      id: 'karl',
      ...C.position(pt.x, pt.y),
      ...C.render('khaki', 'K', 'K'),
      ...C.description('Karl'),
      ...C.tagActor(),
    }
  },
}
