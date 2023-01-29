// TODO clean up duplicate functions/functionality, add later improvements to earlier stages
// TODO make room + walls the canonical way of using rooms
// TODO improve room gen (room size/w/h)
// ? ROT getWeightedValue for room size distribution?
// ? 'grow rooms' at point to desired size?
// TODO Reduce/completely remove CharMaps, create Rect + color/info data snapshots instead - constant array copies are slow
// TODO Refactor Corridor gen
// TODO !!! save RNG state to replicate history as needed? !!!
// TODO smoke tests
// TODO return Room[], Corridor[] along with data

import * as ROT from 'rot-js'
import { Rectangle } from '../../Model/Rectangle'
import { digCorridor, digRect, digRoom, digPts } from './dig'
import { copy } from '../../lib/util'

// Modules

import { generateRoomsClassic } from './generateRoomsClassic'
import { generateRoomsBSP } from './generateRoomsBSP'

export enum RoomModules {
  BSP = 'BSP',
  Classic = 'Classic',
}

import { generateCorridorsClassic } from './generateCorridorsClassic'

export enum CorridorModules {
  Classic = 'Classic',
}

const modules = {
  rooms: { BSP: generateRoomsBSP, Classic: generateRoomsClassic },
  corridors: { Classic: generateCorridorsClassic },
}

export const modulesAvailable = [RoomModules.BSP, RoomModules.Classic]

export interface GEN_CONFIG {
  width: number
  height: number
  minRooms: number
  maxRooms: number
  minRoomW: number
  maxRoomW: number
  minRoomH: number
  maxRoomH: number
  levelEdge: number
  shiftFinal: boolean
  moduleRoomGen: keyof typeof modules.rooms
  moduleCorridorGen: keyof typeof modules.corridors
}

export const DEFAULT_CONFIG: GEN_CONFIG = {
  // level size
  width: 80,
  height: 20,

  // number of rooms
  minRooms: 6,
  maxRooms: 9,

  // room width
  minRoomW: 5,
  maxRoomW: 13,

  // room height
  minRoomH: 3,
  maxRoomH: 7,

  // avoid placing features within this range of the level edge
  levelEdge: 1,

  // Center the level after features generated
  shiftFinal: true,

  // modules
  moduleRoomGen: RoomModules.BSP,
  moduleCorridorGen: CorridorModules.Classic,
}

let CONFIG: GEN_CONFIG

// --- Globals ---
export let history: CharMap[]
let current: CharMap = []

export function create(newConfig?: Partial<GEN_CONFIG>): [number[][], Room[], Point[]] {
  const time = Date.now()
  console.groupCollapsed('%cDungeon4', 'font-weight: bold')
  CONFIG = { ...DEFAULT_CONFIG, ...newConfig }
  console.log('CONFIG:', CONFIG)

  // set module functions
  console.log('modulesAvailable:', modulesAvailable)

  const generateRooms = modules.rooms[CONFIG.moduleRoomGen]
  console.log(`Using module ${CONFIG.moduleRoomGen}:`, generateRooms.name)

  const generateCorridors = modules.corridors[CONFIG.moduleCorridorGen]
  console.log(`Using module ${CONFIG.moduleCorridorGen}:`, generateCorridors.name)

  // set up
  current = [...new Array(CONFIG.height)].map(() => new Array(CONFIG.width).fill(' '))
  current = digRect(current, Rectangle.at(0, 0, CONFIG.width, CONFIG.height), '·')
  current = digRect(current, Rectangle.at(1, 1, CONFIG.width - 2, CONFIG.height - 2), ' ')

  // wipe old history (store this?)
  history = []

  snapshot(current, 'Start')

  const seed = ROT.RNG.getUniformInt(1000, 9999)
  ROT.RNG.setSeed(seed)

  console.log('create() W:', CONFIG.width, 'H:', CONFIG.height, ROT.RNG.getSeed())

  // * Generate Rooms
  const [rooms, roomTime] = generateRooms(CONFIG)

  // * Generate Corridors
  const [corridors, corrTime] = generateCorridors(rooms)

  const [final, shiftedRooms, doorPts] = finalize(rooms, corridors)

  const terrain = generateTerrainData(final)

  const t = Date.now() - time
  snapshot(final, `Complete! Rooms: ${rooms.length}, Corridors: ${corridors.length} Time: ` + t + 'ms', 'done')

  console.groupEnd()
  const logMsg = `Dungeon4 Complete (${t}ms), Rooms: ${rooms.length} (${roomTime}ms), Corridors: ${corridors.length} (${corrTime}ms)`
  consoleLogMap(final, true, logMsg)

  return [terrain, shiftedRooms, doorPts]
}

// #region ===== 3. Finalize =====

// some finishing touches
function finalize(rooms: Room[], corridors: Corridor[]): [CharMap, Room[], Point[]] {
  // Assemble the complete level
  let final = createBlankMap()
  final = digRoom(final, rooms, '.', '#', false)
  final = digCorridor(final, corridors, '.', '#')

  const [finalD, doorPts] = createDoors(final, rooms)

  if (CONFIG.shiftFinal) {
    const [finalS, dx, dy] = centerLevel(finalD, rooms)
    // feature position info needs to be updated
    // console.log('roomshift?')
    const shiftedRooms = rooms.map(r => {
      const { x, y, width, height } = r.rect
      // console.log('old rect', r)
      const rect = Rectangle.at(x + dx, y + dy, width, height)
      // console.log('new rect', rect)
      return new Room(rect, r.label, 1)
    })
    const shiftPts = doorPts.map(pt => ({ x: pt.x + dx, y: pt.y + dy }))
    return [finalS, shiftedRooms, shiftPts]
  }
  return [finalD, rooms, doorPts]
}

function createDoors(level: CharMap, rooms: Room[]): [CharMap, Point[]] {
  // search room borders for '.', should be doorways
  const doorPts = rooms.map(room => {
    return room.border.toPts(true).filter(pt => inBounds(pt.x, pt.y) && level[pt.y][pt.x] === '.')
  })

  // console.log('doorPts:', doorPts)

  const doorMap = digPts(level, doorPts.flat(), '+')
  // snapshot(doorMap, 'The Doors', 'doors')

  // flat() removes which room is associated with each room
  return [doorMap, doorPts.flat()]
}

function centerLevel(level: CharMap, rooms: Room[]): [CharMap, number, number] {
  const xMin = rooms.reduce((prev, curr) => (prev.border.x < curr.border.x ? prev : curr)).border.x
  const xMax = rooms.reduce((prev, curr) => (prev.border.x2 > curr.border.x2 ? prev : curr)).border.x2
  let dx = Math.floor((CONFIG.width - 1 - xMax - xMin) / 2)

  const yMin = rooms.reduce((prev, curr) => (prev.border.y < curr.border.y ? prev : curr)).border.y
  const yMax = rooms.reduce((prev, curr) => (prev.border.y2 > curr.border.y2 ? prev : curr)).border.y2
  let dy = Math.floor((CONFIG.height - 1 - yMax - yMin) / 2)

  dx !== 0 && dy !== 0 && console.log(`Shift level: x ${dx} y: ${dy}`)

  let centeredLevel = level
  // transpose one at a time, for effect
  // ? try skipping if only 1 move
  if (dy < -1 || dy > 1) {
    const yDir = dy < 0 ? -1 : 1
    for (let i = 0; i < Math.abs(dy); i++) centeredLevel = transposeLevelY(centeredLevel, yDir)
  } else dy = 0

  // if (!(dx === 0)) {
  if (dx < -1 || dx > 1) {
    const xDir = dx < 0 ? -1 : 1
    for (let i = 0; i < Math.abs(dx); i++) centeredLevel = transposeLevelX(centeredLevel, xDir)
  } else dx = 0

  return [centeredLevel, dx, dy]
}

function transposeLevelX(level: CharMap, dir: number) {
  if (!(dir === -1 || dir === 1)) {
    console.warn('transposeLevelX: no', dir)
    return level
  }

  const centeredLevel = copy(level)
  if (dir === -1) {
    // move left
    level.forEach((_, yi) => {
      centeredLevel[yi].shift()
      centeredLevel[yi].push(' ')
    })
  } else if (dir === 1) {
    // move right
    centeredLevel.forEach((_, yi) => {
      centeredLevel[yi].pop()
      centeredLevel[yi].unshift(' ')
    })
  }
  snapshot(centeredLevel, 'Shift X', 'shift')

  return centeredLevel
}

function transposeLevelY(level: CharMap, dir: number) {
  if (!(dir === -1 || dir === 1)) {
    // console.warn('transposeLevelY: no', dir)
    return level
  }

  const centeredLevel = copy(level)
  if (dir === -1) {
    // move up
    centeredLevel.shift()
    centeredLevel.push(new Array(CONFIG.width).fill(' '))
  } else if (dir === 1) {
    // move down
    centeredLevel.pop()
    centeredLevel.unshift(new Array(CONFIG.width).fill(' '))
  }
  snapshot(centeredLevel, 'Shift Y', 'shift')

  return centeredLevel
}

// #endregion

/// ======== Utility

export function inBounds(x: number, y: number, within = 0) {
  return x >= 0 + within && x < CONFIG.width - within && y >= 0 + within && y < CONFIG.height - within
}

export function rectInBounds(rect: Rectangle, within = 0) {
  return inBounds(rect.x, rect.y, within) && inBounds(rect.x2, rect.y2, within)
}

export function snapshot(map: CharMap, label: string | number = '(no label!)', group = '') {
  const snap = copy(map)

  history.push([[`${label}`, group], ...snap])
}

export function createBlankMap(c = ' '): CharMap {
  return [...new Array(CONFIG.height)].map(() => new Array(CONFIG.width).fill(c[0]))
}

// rot-js style 0/1 terrain map for game
function generateTerrainData(level: CharMap): number[][] {
  return level.map(row => row.map(e => ('.+'.includes(e) ? 0 : 1)))
}

export function consoleLogMap(map: CharMap, group = false, label = 'CharMap', style = '') {
  group ? console.groupCollapsed(label, style) : console.group(label, style)
  // top border
  let top = '*\\'
  map[0].forEach((_, i) => {
    top += `${i % 10}`
  })
  console.log(top + '/')

  map.forEach((e, i) => {
    console.log((i % 10) + '>' + e.join('') + '<')
  })
  console.groupEnd()
}

export function rnd(min: number, max: number) {
  return ROT.RNG.getUniformInt(min, max)
}

// random odd int
export function rndO(min: number, max: number) {
  let n
  do {
    n = rnd(min, max)
  } while (n % 2 === 0)
  return n
}

export function isOdd(n: number) {
  return n % 2 == 1
}

// make a number odd, by squishing it a bit
export function odd(n: number) {
  return isOdd(n) ? n : n - 1
}

export function clamp(min: number, n: number, max: number, debug = false) {
  debug && console.log(`clamp ${n} - min: ${min} ${n < min} / max: ${max} ${n > max}`)
  if (n < min) return min
  if (n > max) return max
  return n
}

export function max(n: number, max: number) {
  return n < max ? n : max
}

export function floor(n: number) {
  return Math.floor(n)
}

export function half(n: number) {
  return Math.floor(n / 2)
}

export function larger(n1: number, n2: number) {
  return n1 >= n2 ? n1 : n2
}

// Types/Features
export type Dungeon4Data = [number[][], Room[], Point[]]
export type CharMap = string[][]
export type Point = { x: number; y: number }

export class Room {
  readonly rect: Rectangle
  readonly label: string
  border: Rectangle

  constructor(rect: Rectangle, label: string | number, borderSize: number) {
    this.rect = rect
    this.label = `${label}`
    this.border = rect.scale(borderSize)
  }

  static scaled(x: number, y: number, xScale: number, yScale: number, label: string | number = '?', borderSize = 1) {
    const rect = Rectangle.scaled(x, y, xScale, yScale)

    return new Room(rect, label, borderSize)
  }
}

export class Corridor {
  readonly points: Point[]
  readonly label: number
  constructor(points: Point[], label: number) {
    this.points = points
    this.label = label
  }
}
export { copy }
