import { Engine } from './Engine'

export function UI(engine: Engine, ui: string) {
  const { local, options } = engine
  if (ui === 'debug_logworld') console.log(engine)
  if (ui === 'debug_logentities') console.log('Local entities', local.entities)
  if (ui === 'debug_loglocal') console.log('Local', local)
  if (ui === 'debug_loglogger') window.logger.info()

  switch (ui) {
    case 'revealAll':
      local.revealAll = !local.revealAll
      localStorage.setItem('revealAll', `${local.revealAll}`)
      engine.uiMessage(`revealAll: ${local.revealAll}`)
      break
    case 'animation':
      options.formUpdate = !options.formUpdate
      options.lightingUpdate = !options.lightingUpdate
      engine.uiMessage(`animation ${options.formUpdate}`)
      break
  }

  // if (ui === 'bgCycle') {
  //   options.bgCycle = !options.bgCycle
  //   engine.uiMessage(`cycleBg: ${options.bgCycle}`)
  // }

  // if (ui === 'localRecallAll') {
  //   local.recallAll = !local.recallAll
  //   engine.uiMessage(`recallAll: ${local.recallAll}`)
  // }
  local.hasChanged = true
}
