import { ActionTypes, Engine } from '../Core'

export function handleDomainChange(engine: Engine, action: ActionTypes) {
  if (!('changeDomain' in action)) return
  const { atlas, index: domain } = engine
  const { to } = action.changeDomain

  if (domain === to || !atlas[to]) return
  engine.index = to
  const index = atlas[to].current
  engine.local = atlas[to].regions[index]
}
