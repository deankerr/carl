import * as ROT from 'rot-js'
import { BlockMovement, ConsoleRender, Position } from '../components'
import { Entity, qCreateDoggy, qCreateDoorAt, qCreateOrc } from './__entity'
import { Terrain, TerrainDict } from './__Terrain'

export type TerrainMap = { [key: string]: number }
export type SeenMap = { [key: string]: boolean }

type EntityMapCallback = (x: number, y: number, r: ConsoleRender) => void
type TMapCallback = (x: number, y: number, t: Terrain) => void

let id = 0

export type Level = {
  levelData: {
    entities: Entity[]
    terrainMap: TerrainMap
    seen: SeenMap
    subtype?: string
  }
  levelID: number
  add: (entity: Entity | Entity[]) => void
  remove: (entity: Entity) => void
  getTerrainMap: (callback: TMapCallback) => void
  getRenderableEntities: (callback: EntityMapCallback) => void
  isTransparent: (x: number, y: number) => boolean
  isInBounds: (x: number, y: number) => boolean
  see: (x: number, y: number) => void
  isSeen: (x: number, y: number) => boolean
  isWalkable: (x: number, y: number) => boolean
  terrainAt: (x: number, y: number) => Terrain
  entitiesAt: (x: number, y: number) => Entity[]
  getRandomWalkable: () => { x: number; y: number }
  entities: Entity[]
}

// this wholte thing is bad
export function Level({
  terrainMap,
  seen,
  subtype = '',
  doorsAt = [],
}: {
  terrainMap: TerrainMap
  seen: SeenMap
  levelWidth: number
  levelHeight: number
  subtype: string
  doorsAt?: number[][]
}): Level {
  console.log(terrainMap)
  const levelID = id++
  let entities: Entity[] = []
  const width = 80 // ???? fix this
  const height = 20

  // Dung1 doors
  doorsAt.forEach((d) => add(qCreateDoorAt(d[0], d[1])))

  // Demo entities
  add(qCreateDoggy(getRandomWalkable()))
  add(qCreateDoggy(getRandomWalkable()))

  add(qCreateOrc(getRandomWalkable()))
  add(qCreateOrc(getRandomWalkable()))
  add(qCreateOrc(getRandomWalkable()))

  console.log('level start', entities)

  const levelData = { entities, terrainMap, seen, subtype }

  return {
    levelID,
    levelData,
    add,
    getTerrainMap,
    getRenderableEntities,
    isTransparent,
    isInBounds,
    see,
    isSeen,
    isWalkable,
    terrainAt,
    entitiesAt,
    getRandomWalkable,
    entities,
    remove,
  }

  function add(entity: Entity | Entity[]) {
    if (Array.isArray(entity)) {
      entity.forEach((e) => add(e))
    } else {
      entities.push(entity)
    }
  }

  function remove(entity: Entity) {
    entities = entities.filter((e) => e !== entity)
    console.log('KILL', entity.id)
  }

  function getTerrainMap(callback: TMapCallback) {
    for (const key in terrainMap) {
      const { x, y } = keyToXY(key)
      const terrain = TerrainDict[terrainMap[key]]
      callback(x, y, terrain)
    }
  }

  // bad function name
  function getRenderableEntities(callback: EntityMapCallback) {
    const renderable = entities.filter((e) => e.has(ConsoleRender) && e.has(Position))
    renderable.forEach((e) => {
      const pos = e.get(Position)
      const ren = e.get(ConsoleRender)
      callback(pos.x, pos.y, ren)
    })
  }

  function see(x: number, y: number) {
    seen[`${x}-${y}`] = true
  }

  function isSeen(x: number, y: number) {
    return seen[`${x}-${y}`]
  }

  function isWalkable(x: number, y: number) {
    if (!isInBounds(x, y)) return false
    const e = entities.filter((e) => {
      if (e.has(Position)) {
        const pos = e.get(Position)
        if (pos.x === x && pos.y === y) {
          return e.has(BlockMovement)
        }
      }
      return false
    })

    if (e.length) return false
    return terrainAt(x, y).walkable
  }

  function terrainAt(x: number, y: number) {
    if (!isInBounds(x, y)) throw new Error(`terrainAt(${x}-${y}): Out of bounds`)
    const t = terrainMap[XYtoKey(x, y)]
    return TerrainDict[t]
  }

  function entitiesAt(x: number, y: number) {
    const e = entities.filter((e) => {
      if (e.has(Position)) {
        const pos = e.get(Position)
        if (pos.x == x && pos.y == y) return true
      }
      return false
    })

    return e
  }

  function isTransparent(x: number, y: number): boolean {
    const t = TerrainDict[terrainMap[XYtoKey(x, y)]]
    return isInBounds(x, y) && t.transparent
  }

  function isInBounds(x: number, y: number) {
    return x >= 0 && x < width && y >= 0 && y < height
  }

  function getRandomWalkable() {
    for (let i = 0; i <= 10000; i++) {
      const x = ROT.RNG.getUniformInt(0, width - 1)
      const y = ROT.RNG.getUniformInt(0, height - 1)

      if (isWalkable(x, y)) return { x, y }
    }

    throw new Error('Could not find random walkable :(')
  }

  function keyToXY(key: string) {
    const arr = key.split('-')
    return { x: parseInt(arr[0]), y: parseInt(arr[1]) }
  }

  function XYtoKey(x: number, y: number) {
    return `${x}-${y}`
  }
}
