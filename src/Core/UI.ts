import { Engine } from './Engine'

export function UI(engine: Engine, ui: string) {
  const { local, options } = engine
  if (ui === 'debug_logworld') console.log(engine)
  if (ui === 'debug_logentities') console.log('Local entities', local.entities)
  if (ui === 'debug_loglocal') console.log('Local', local)
  if (ui === 'debug_loglogger') console.log(window.logger)
  if (ui === 'localRevealAll') {
    local.revealAll = !local.revealAll
    engine.uiMessage(`revealAll: ${local.revealAll}`)
  }
  if (ui === 'localRecallAll') {
    local.recallAll = !local.recallAll
    engine.uiMessage(`recallAll: ${local.recallAll}`)
  }
  if (ui === 'playerLight') {
    options.playerLight = !options.playerLight

    const [player] = engine.local.get('playerControlled', 'emitLight')
    if (player)
      engine.local.entity(player).modify('emitLight', player.emitLight.color, options.playerLight)

    engine.uiMessage(`playerLight: ${options.playerLight}`)
  }
  if (ui === 'formCycle') {
    options.formUpdate = !options.formUpdate
    engine.uiMessage(`formUpdate: ${options.formUpdate}`)
  }
  if (ui === 'lightingUpdate') {
    options.lightingUpdate = !options.lightingUpdate
    engine.uiMessage(`lightingUpdate: ${options.lightingUpdate}`)
  }
  // if (ui === 'bgCycle') {
  //   options.bgCycle = !options.bgCycle
  //   engine.uiMessage(`cycleBg: ${options.bgCycle}`)
  // }
}
