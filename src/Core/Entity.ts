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
      ...C.render('+', 'saddlebrown'),
      ...C.renderSeenColor('#4d2509'),
      ...C.description('door'),
      ...C.door(),
      ...C.trodOn('You carefully navigate through the door.'),
    }
  },

  player: (pt: Point, fov?: number) => {
    return {
      id: 'player',
      ...C.position(pt.x, pt.y),
      ...C.render('@', 'white'),
      ...C.description('yourself'),
      ...C.tagPlayer(),
      ...C.tagActor(),
      ...C.fov(fov ?? 5),
      ...C.seen(),
    }
  },

  orc: (pt: Point) => {
    return {
      id: 'orc',
      ...C.position(pt.x, pt.y),
      ...C.render('o', 'green'),
      ...C.description('orc'),
      ...C.tagActor(),
    }
  },

  spider: (pt: Point) => {
    return {
      id: 'spider',
      ...C.position(pt.x, pt.y),
      ...C.render('x', 'lightblue'),
      ...C.description('tarantula'),
      ...C.tagActor(),
    }
  },

  snake: (pt: Point) => {
    return {
      id: 'snake',
      ...C.position(pt.x, pt.y),
      ...C.render('s', 'lightgreen'),
      ...C.description('taipan'),
      ...C.tagActor(),
    }
  },

  toad: (pt: Point) => {
    return {
      id: 'toad',
      ...C.position(pt.x, pt.y),
      ...C.render('t', 'limegreen'),
      ...C.description('menacing toad'),
      ...C.tagActor(),
    }
  },

  crab: (pt: Point) => {
    return {
      id: 'crab',
      ...C.position(pt.x, pt.y),
      ...C.render('c', 'red'),
      ...C.description('doomcrab'),
      ...C.tagActor(),
    }
  },

  ghost: (pt: Point) => {
    return {
      id: 'ghost',
      ...C.position(pt.x, pt.y),
      ...C.render('g', 'white'),
      ...C.description('ghost'),
      ...C.tagActor(),
    }
  },

  demon: (pt: Point) => {
    return {
      id: 'demon',
      ...C.position(pt.x, pt.y),
      ...C.render('D', 'orangered'),
      ...C.description('demon'),
      ...C.tagActor(),
    }
  },

  hammerhead: (pt: Point) => {
    return {
      id: 'hammerhead',
      ...C.position(pt.x, pt.y),
      ...C.render('H', 'orange'),
      ...C.description('hammerhead shark man'),
      ...C.tagActor(),
    }
  },

  skeleton: (pt: Point) => {
    return {
      id: 'skeleton',
      ...C.position(pt.x, pt.y),
      ...C.render('S', 'white'),
      ...C.description('skellybones'),
      ...C.tagActor(),
    }
  },

  chicken: (pt: Point) => {
    return {
      id: 'chicken',
      ...C.position(pt.x, pt.y),
      ...C.render('c', 'grey'),
      ...C.description("lil' chickadee"),
      ...C.tagActor(),
    }
  },

  bat: (pt: Point) => {
    return {
      id: 'bat',
      ...C.position(pt.x, pt.y),
      ...C.render('a', 'red'),
      ...C.description('bat from hell'),
      ...C.tagActor(),
    }
  },
}
