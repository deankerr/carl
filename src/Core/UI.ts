import { CONFIG } from '../config'
import { floor } from '../lib/util'
import { Engine } from './Engine'

export function UI(engine: Engine, ui: string) {
  const { local, options } = engine
  let msg

  // testing/debug
  if (ui === 'doSomething') {
    msg = "I'm doing... something"
    engine.textDisplay._options.tileMap = { ...engine.textDisplay._options.tileMap, W: [528, 112] }
  }

  if (ui === 'uDoSomething') {
    msg = 'U do something'
    // test - destroy entities with children
    const sc = engine.local.get('children')
    sc.forEach(e => engine.local.destroy(e))
  }

  if (ui === 'logWorld') {
    console.log(engine)
    console.log('Local entities', local.entityList)
    console.log('Local', local)
    msg = `The world...`
  }

  if (ui === 'logTile') {
    msg = logTile(engine)
  }

  if (ui === 'revealAll') {
    engine.options.revealAll = !engine.options.revealAll
    local.revealAll = !local.revealAll
    localStorage.setItem('revealAll', `${local.revealAll}`)
    msg = `revealAll ${local.revealAll}`
  }

  if (ui === 'displayZoomIn') msg = resizeDisplay(engine, 1)
  if (ui === 'displayZoomOut') msg = resizeDisplay(engine, -1)
  if (ui === 'displayDefault') msg = resizeDisplay(engine, 0)
  if (ui === 'displayRegion') msg = resizeDisplay(engine, 99)

  if (ui === 'debugMode') {
    options.debugMode = !options.debugMode
    msg = options.debugMode ? 'Welcome to Debug' : 'Bugs defeated'
  }

  if (ui === 'toggleHeatMap') {
    options.showHeatMap = !options.showHeatMap
    engine.local.debugSymbolMap.clear()
    engine.system.change()
    msg = 'Heat Map'
  }

  msg ? engine.uiMessage(msg) : engine.uiMessage(`UI:${ui} unhandled`)
  local.hasChanged = true
}

function resizeDisplay(engine: Engine, n: number) {
  const { mainDisplay } = engine
  const size = { width: CONFIG.mainDisplayWidth, height: CONFIG.mainDisplayHeight }

  if (n === 99) {
    size.width = engine.local.width
    size.height = engine.local.height
  } else if (n < 0 || n > 0) {
    size.width = mainDisplay.getOptions().width + 10 * n
    size.height = floor(size.width / 2.02)
  }

  engine.mainDisplay.setOptions({ width: size.width, height: size.height })
  return `${size.width} x ${size.height}`
}

function logTile(engine: Engine) {
  const [p] = engine.local.get('playerControlled', 'position')
  console.log(p.position.s, engine.local.at(p.position))
  return `Entities at ${p.position.s}`
}

// if (ui === 'localRecallAll') {
//   local.recallAll = !local.recallAll
//   engine.uiMessage(`recallAll: ${local.recallAll}`)
// }
