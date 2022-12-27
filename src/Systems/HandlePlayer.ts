import * as ROT from 'rot-js'
import { Action } from '../Actions'
import { NPC, Position } from '../components'
import { Die } from '../components/Die'
import { Entity } from '../__dep/__entity'
import { Level } from '../__Level'

export function HandlePlayer(pc: Entity, action: Action, level: Level, msg: string[]) {
  console.log(`=== Handle Player === `)

  if ('wait' in action) {
    console.log('Wait')
    return
  }

  if ('move' in action) {
    // console.log('Move', action.move)
    const pos = pc.get(Position)
    const newX = pos.x + action.dx
    const newY = pos.y + action.dy

    // Touch entities
    if (level.entitiesAt(newX, newY).length > 0) {
      const targets = level.entitiesAt(newX, newY)
      console.log('targets:', targets)

      // Kill npc
      const NPCs = targets.filter((e) => e.has(NPC))
      if (NPCs.length > 0) {
        ROT.RNG.getPercentage() > 50
          ? msg.push('You splat the {whatever} into little pieces.')
          : msg.push('You simply wish the {whocares} into unexistence.')
        level.entitiesAt(newX, newY).forEach((e) => e.add(Die()))
        level.remove(NPCs[0])
        return
      }

      // otherwise its a door ????
      else msg.push('You skillfully phase through the door.')
    }

    // console.log('lets walk')
    if (level.isInBounds(newX, newY) && level.isWalkable(newX, newY)) {
      pos.x = newX
      pos.y = newY
    }

    return
  }

  if ('changeLevel' in action) {
    console.log('Change level', action.changeLevel)

    return
  }

  throw new Error(`No action definined for: ${Object.entries(action)}`)
}
