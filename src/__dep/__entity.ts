import {
  BlockMovement,
  Component,
  ComponentI,
  ConsoleRender,
  FOV,
  NPC,
  NPCChasePlayer,
  NPCWander,
  Player,
  Position,
} from '../components'

export interface Entity {
  id: string
  components: Map<string, Component>
  add: (component: Component) => void
  has: <T extends Component>(componentFn: ComponentI<T>) => boolean
  get: <T extends Component>(componentFn: ComponentI<T>) => T
}

let count = 0

const entity = (tag?: string) => {
  const id = tag ? `${count++}-${tag}` : `${count++}`
  const components = new Map<string, Component>()

  const add = (component: Component) => {
    components.set(component.id, component)
  }

  // TODO Rethink funciton names
  const get = <T extends Component>(componentFn: ComponentI<T>): T => {
    return components.get(componentFn.name) as T
  }

  const has = <T extends Component>(componentFn: ComponentI<T>): boolean => {
    return components.has(componentFn.name)
  }

  const entity: Entity = {
    id,
    components,
    add,
    get,
    has,
  }

  // console.log(`Created new entity ${entity.id}`)
  // console.log(`Created new entity`)
  return entity
}

export { entity }

type newPos = { x: number; y: number }
export function qCreatePlayer(pos: newPos) {
  const { x, y } = pos
  const player = entity(`player`)
  player.add(Position(x, y))
  player.add(ConsoleRender('@', 'white'))
  player.add(BlockMovement())
  player.add(Player())
  player.add(FOV(5))

  return player
}

export function qCreateOrc(pos: newPos) {
  const { x, y } = pos
  const orc = entity('orc')
  orc.add(Position(x, y))
  orc.add(ConsoleRender('o', 'lightgreen'))
  orc.add(BlockMovement())
  orc.add(NPC())
  orc.add(NPCChasePlayer())

  return orc
}

export function qCreateDoggy(pos: newPos) {
  const { x, y } = pos
  const doggy = entity('doggy')
  doggy.add(Position(x, y))
  doggy.add(ConsoleRender('d', 'blue'))
  doggy.add(BlockMovement())
  doggy.add(NPC())
  doggy.add(NPCWander())
  return doggy
}

export function qCreateDoorAt(x: number, y: number) {
  return qCreateDoor({ x, y })
}

export function qCreateDoor(pos: newPos) {
  const { x, y } = pos
  const door = entity('door')
  door.add(Position(x, y))
  door.add(ConsoleRender('+', 'saddlebrown'))
  return door
}
