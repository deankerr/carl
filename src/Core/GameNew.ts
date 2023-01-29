import { WorldNew } from './WorldNew'
export class GameNew {
  world = new WorldNew()
}

/*

Game - other game data
- play turns/time, Player itself(?), message log


  World - collection of Levels? Describes how areas connect

  Level/Region/Area/Zone
  - has prev World ECS methods (allow using multiple "Worlds" at once)


*/
