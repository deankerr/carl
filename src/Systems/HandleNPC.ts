import { Path, RNG } from 'rot-js'
import { NPCChasePlayer, NPC, Position, NPCWander } from '../components'
import { Entity } from '../__dep/__entity'
import { Level } from '../__Level'
import { Direction, Move } from '../Actions'
import { Die } from '../components/Die'

export function HandleNPCs(level: Level, player: Entity, msg: string[]) {
  console.log('== Handle NPCs ==')
  const entities = level.entities.filter((e) => !e.has(Die))

  const NPCs = entities.filter((e) => e.has(NPC))

  const chaser = NPCs.filter((e) => e.has(NPCChasePlayer))

  const { x: px, y: py } = player.get(Position)
  chaser.forEach((e) => {
    const { x: cx, y: cy } = e.get(Position)

    // TODO: Imrprove pathing through other entities
    const pathPlayer = new Path.AStar(px, py, (x, y) => {
      // Force the origin and destination to be pathable to please the algorithm
      if (x == cx && y == cy) return true
      if (x == px && y == py) return true
      return level.isWalkable(x, y)
    })
    console.log(`${e.id} is chasing the player from ${cx},${cy}`)
    const path: { x: number; y: number }[] = []

    pathPlayer.compute(cx, cy, (x, y) => path.push({ x, y }))

    if (path.length == 0) {
      console.log('Cannot find path to player!')
      wander(level, e)
      return
    }
    const { x: newX, y: newY } = path[1]

    if (newX === px && newY === py) {
      RNG.getPercentage() > 50
        ? msg.push('The orc points at you, stupidly.')
        : msg.push('The orc stares at you for a few moments.')
    } else {
      const pos = e.get(Position)
      pos.x = newX
      pos.y = newY
    }
  })

  const wanderer = NPCs.filter((e) => e.has(NPCWander))
  wanderer.forEach((e) => wander(level, e))
}

function wander(level: Level, e: Entity) {
  console.log(`${e.id} is wandering aimlessly.`)

  if (Math.random() < 0.2) {
    console.log('Woof!')
    return
  }

  const rnd = RNG.getItem([
    Direction.E,
    Direction.N,
    Direction.NE,
    Direction.NW,
    Direction.S,
    Direction.SE,
    Direction.SW,
    Direction.W,
  ])

  if (!rnd) return
  const move = Move(rnd)

  const pos = e.get(Position)
  const newX = pos.x + move.dx
  const newY = pos.y + move.dy

  if (!level.isWalkable(newX, newY)) return

  pos.x = newX
  pos.y = newY
}
