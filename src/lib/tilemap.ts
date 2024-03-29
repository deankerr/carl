export function createOryxTinyMap(size: number) {
  const tiles = [
    [
      'dungeonHorizontal1',
      'dungeonHorizontal2',
      'dungeonHorizontal3',
      'dungeonHorizontal4',
      'dungeonHorizontal5',
      'dungeonHorizontal6',
      'dungeonVertical1',
      'dungeonVertical2',
      'dungeonVertical3',
      'dungeonVertical4',
      'dungeonVertical5',
      'dungeonVertical6',
      'dungeonStairsDown',
      'dungeonStairsUp',
      'dungeonWell',
      'dungeonWellEmpty',
    ],
    [
      'caveHorizontal1',
      'caveHorizontal2',
      'caveHorizontal3',
      'caveHorizontal4',
      'caveHorizontal5',
      'caveHorizontal6',
      'caveVertical1',
      'caveVertical2',
      'caveVertical3',
      'caveVertical4',
      'caveVertical5',
      'caveVertical6',
      'caveStairsDown',
      'caveStairsUp',
      'caveWell',
      'caveWellEmpty',
    ],
    [
      'cryptHorizontal1',
      'cryptHorizontal2',
      'cryptHorizontal3',
      'cryptHorizontal4',
      'cryptHorizontal5',
      'cryptHorizontal6',
      'cryptVertical1',
      'cryptVertical2',
      'cryptVertical3',
      'cryptVertical4',
      'cryptVertical5',
      'cryptVertical6',
      'cryptStairsDown',
      'cryptStairsUp',
      'cryptWell',
      'cryptWellEmpty',
    ],
    [
      'cavernHorizontal1',
      'cavernHorizontal2',
      'cavernHorizontal3',
      'cavernHorizontal4',
      'cavernHorizontal5',
      'cavernHorizontal6',
      'cavernVertical1',
      'cavernVertical2',
      'cavernVertical3',
      'cavernVertical4',
      'cavernVertical5',
      'cavernVertical6',
      'cavernStairsDown',
      'cavernStairsUp',
      'cavernWell',
      'cavernWellEmpty',
    ],
    [
      'stoneFloor1',
      'stoneFloor2',
      'stoneFloor3',
      'stoneFloor4',
      'stoneFloor5',
      'stoneFloor6',
      'stoneFloorGrate',
      'stoneFloorPit',
    ],
    [
      'dirtFloor1',
      'dirtFloor2',
      'dirtFloor3',
      'dirtFloor4',
      'dirtFloor5',
      'dirtFloor6',
      'dirtFloorHole',
      'dirtFloorPit',
      'grass1',
      'grass2',
      'grass3',
      'grass4',
      'grass5',
      'grass6',
      'grassHole',
      'grassPit',
    ],
    [
      'abyss',
      'stoneTileFloor1',
      'stoneTileFloor2',
      'stoneTileFloor3',
      'stoneTileFloor4',
      'stoneTileFloor5',
      'beigeTileFloor1',
      'beigeTileFloor2',
      'beigeTileFloor3',
      'beigeTileFloor4',
      'beigeTileFloor5',
      'carpet1',
      'carpet2',
      'carpet3',
      'carpetEmblem1',
      'carpetEmblem2',
    ],
    [
      'nothing',
      'dirtTileFloor0',
      'dirtTile',
      'dirtTiles1',
      'dirtTiles2',
      'dirtTiles3',
      'stonePebbleFloor1',
      'stonePebbleFloor2',
      'stonePebbleFloor3',
      'stonePebbleFloor4',
      'stonePebbleFloor5',
      'mossTileFloor1',
      'mossTileFloor2',
      'mossTileFloor3',
      'mossTileFloor4',
      'mossTileFloor5',
    ],
    [
      'waterClearLedge',
      'waterClear',
      'waterLedge1',
      'waterLedge2',
      'water1',
      'water2',
      'slimeClearLedge',
      'slimeClear',
      'slimeLedge1',
      'slimeLedge2',
      'slime1',
      'slime2',
      'oilLedge1',
      'oilLedge2',
      'oil1',
      'oil2',
    ],
    [
      'acidClearLedge',
      'acidClear',
      'acidLedge1',
      'acidLedge2',
      'acid1',
      'acid2',
      'lavaClearLedge',
      'lavaClear',
      'lavaLedge1',
      'lavaLedge2',
      'lava1',
      'lava2',
      'sludgeLedge1',
      'sludgeLedge2',
      'sludge1',
      'sludge2',
    ],
    [
      'woodenDoorClosed',
      'woodenDoorOpen',
      'woodenDoorVerticalClosed',
      'woodenDoorVerticalClosedTop',
      'woodenDoorVerticalOpenTop',
      'woodenDoorVerticalOpen',
      'jailDoorClosed',
      'jailDoorOpen',
      'jailDoorVerticalClosed',
      'jailDoorVerticalClosedTop',
      'jailDoorVerticalOpenTop',
      'jailDoorVerticalOpen',
      'cellarDoorClosed',
      'cellarDoorOpen',
      'cellarDoorOpenUpper',
      'lightShadow',
    ],
    [
      'stoneDoorClosed',
      'stoneDoorOpen',
      'stoneDoorVerticalClosed',
      'stoneDoorVerticalClosedTop',
      'stoneDoorVerticalOpenTop',
      'stoneDoorVerticalOpen',
      'redDoorClosed',
      'redDoorOpen',
      'redDoorVerticalClosed',
      'redDoorVerticalClosedTop',
      'redDoorVerticalOpenTop',
      'redDoorVerticalOpen',
      'woodenBoards1',
      'woodenBoards2',
      'woodenBoards3',
      'woodenPanel',
    ],
    [
      'crate',
      'crateSmashed',
      'chest',
      'chestOpenFull',
      'chestOpenEmpty',
      'sconce1',
      'sconce2',
      'sconceLower1',
      'sconceLower2',
      'tombstone1',
      'tombstone2',
      'lever1',
      'lever2',
      'bearTrap',
      'stoneBoulder',
      'dirtBoulder',
    ],
    [
      'webNW',
      'webNE',
      'webSW',
      'webSE',
      'web',
      'auraWhite',
      'auraBlue',
      'auraRed',
      'auraGreen',
      'auraPurple',
      'auraPurple2',
      'bloodDrops1',
      'bloodDrops2',
      'bloodDrops3',
      'bloodDrops4',
      'bloodDrops5',
    ],
    [
      'grassTuft1',
      'grassTuft2',
      'grassTuft3',
      'grassTuft4',
      'grassTuft5',
      'redMushrooms',
      'purpleMushrooms',
      'yellowMushrooms',
      'lilypad11',
      'lilypad21',
      'lilypad31',
      'lilypad41',
      'lilypad12',
      'lilypad22',
      'lilypad32',
      'lilypad42',
    ],
    [
      'bookshelf',
      'bookshelfEmpty',
      'bed',
      'woodenChair',
      'woodenTable',
      'woodenTableLargeLeft',
      'woodenTableLargeMiddle',
      'woodenTableLargeRight',
      'chairTableLeft',
      'woodenTableLargeMiddleDoc',
      'chairTableRight',
      'altarBlood',
      'altarBones',
      'altarLargeLeft',
      'altarLargeMiddle',
      'altarLargeRight',
    ],
    [
      'grassCut1',
      'grassCut2',
      'grassCut3',
      'grassCut4',
      'grassCut5',
      'shrub1',
      'shrub2',
      'grassTile',
      'grassTiles1',
      'grassTiles2',
      'grassTiles3',
      'campfireUnlit',
      'campfire1',
      'campfire2',
      'throneRed',
      'thronePurple',
    ],
    [
      'buildingWindow1',
      'buildingDoor',
      'buildingDoorOpen',
      'buildingRoofFront1',
      'buildingRoofFront2',
      'buildingRoof1',
      'buildingRoof2',
      'buildingChimney',
      'signBlank',
      'signWeapon',
      'signPotion',
      'signInn',
      'buildingWindow2',
      'statueDragon',
      'statueWarrior',
      'statueMonster',
    ],
    [
      'bones1',
      'bones2',
      'bones3',
      'candles1',
      'candles2',
      'candlesSE1',
      'candlesSE2',
      'candlesNE1',
      'candlesNE2',
      'cauldron1',
      'cauldron2',
      'pots1',
      'pots2',
      'pot',
    ],
    [
      'web1',
      'web2',
      'sand',
      'sandLedge',
      'cactus',
      'dirtLedge',
      'fogLight',
      'fogMedium',
      'fogHeavy',
      'fogRed',
      'fogGreen',
    ],
    [
      'dirtFloorOutdoor1',
      'dirtFloorOutdoor2',
      'dirtFloorOutdoor3',
      'dirtFloorOutdoor4',
      'dirtFloorOutdoor5',
      'dirtFloorOutdoor6',
    ],
    [],
    [],
    [
      'warriorE1',
      'warriorS1',
      'warriorN1',
      'warriorW1',
      'barbarianE1',
      'barbarianS1',
      'barbarianN1',
      'barbarianW1',
      'rogueE1',
      'rogueS1',
      'rogueN1',
      'rogueW1',
      'paladinE1',
      'paladinS1',
      'paladinN1',
      'paladinW1',
    ],
    [
      'warriorE2',
      'warriorS2',
      'warriorN2',
      'warriorW2',
      'barbarianE2',
      'barbarianS2',
      'barbarianN2',
      'barbarianW2',
      'rogueE2',
      'rogueS2',
      'rogueN2',
      'rogueW2',
      'paladinE2',
      'paladinS2',
      'paladinN2',
      'paladinW2',
    ],
    [
      'swordsmanE1',
      'swordsmanS1',
      'swordsmanN1',
      'swordsmanW1',
      'sorceressE1',
      'sorceressS1',
      'sorceressN1',
      'sorceressW1',
      'witchE1',
      'witchS1',
      'witchN1',
      'witchW1',
      'priestE1',
      'priestS1',
      'priestN1',
      'priestW1',
    ],
    [
      'swordsmanE2',
      'swordsmanS2',
      'swordsmanN2',
      'swordsmanW2',
      'sorceressE2',
      'sorceressS2',
      'sorceressN2',
      'sorceressW2',
      'witchE2',
      'witchS2',
      'witchN2',
      'witchW2',
      'priestE2',
      'priestS2',
      'priestN2',
      'priestW2',
    ],
    [
      'druidE1',
      'druidS1',
      'druidN1',
      'druidW1',
      'mageE1',
      'mageS1',
      'mageN1',
      'mageW1',
      'archerE1',
      'archerS1',
      'archerN1',
      'archerW1',
      'bardE1',
      'bardS1',
      'bardN1',
      'bardW1',
    ],
    [
      'druidE2',
      'druidS2',
      'druidN2',
      'druidW2',
      'mageE2',
      'mageS2',
      'mageN2',
      'mageW2',
      'archerE2',
      'archerS2',
      'archerN2',
      'archerW2',
      'bardE2',
      'bardS2',
      'bardN2',
      'bardW2',
    ],
    [
      'goblinSwordE1',
      'goblinSwordS1',
      'goblinSwordN1',
      'goblinSwordW1',
      'goblinShamanE1',
      'goblinShamanS1',
      'goblinShamanN1',
      'goblinShamanW1',
      'goblinSpearE1',
      'goblinSpearS1',
      'goblinSpearN1',
      'goblinSpearW1',
      'bigGoblinE1',
      'bigGoblinS1',
      'bigGoblinN1',
      'bigGoblinW1',
    ],
    [
      'goblinSwordE2',
      'goblinSwordS2',
      'goblinSwordN2',
      'goblinSwordW2',
      'goblinShamanE2',
      'goblinShamanS2',
      'goblinShamanN2',
      'goblinShamanW2',
      'goblinSpearE2',
      'goblinSpearS2',
      'goblinSpearN2',
      'goblinSpearW2',
      'bigGoblinE2',
      'bigGoblinS2',
      'bigGoblinN2',
      'bigGoblinW2',
    ],
    [
      'skeletonE1',
      'skeletonS1',
      'skeletonN1',
      'skeletonW1',
      'skeletonWarriorE1',
      'skeletonWarriorS1',
      'skeletonWarriorN1',
      'skeletonWarriorW1',
      'skeletonShamanE1',
      'skeletonShamanS1',
      'skeletonShamanN1',
      'skeletonShamanW1',
      'skeletonKingE1',
      'skeletonKingS1',
      'skeletonKingN1',
      'skeletonKingW1',
    ],
    [
      'skeletonE2',
      'skeletonS2',
      'skeletonN2',
      'skeletonW2',
      'skeletonWarriorE2',
      'skeletonWarriorS2',
      'skeletonWarriorN2',
      'skeletonWarriorW2',
      'skeletonShamanE2',
      'skeletonShamanS2',
      'skeletonShamanN2',
      'skeletonShamanW2',
      'skeletonKingE2',
      'skeletonKingS2',
      'skeletonKingN2',
      'skeletonKingW2',
    ],
    [
      'vampireE1',
      'vampireS1',
      'vampireN1',
      'vampireW1',
      'zombieE1',
      'zombieS1',
      'zombieN1',
      'zombieW1',
      'beholderE1',
      'beholderS1',
      'beholderN1',
      'beholderW1',
      'evilKnightE1',
      'evilKnightS1',
      'evilKnightN1',
      'evilKnightW1',
    ],
    [
      'vampireE2',
      'vampireS2',
      'vampireN2',
      'vampireW2',
      'zombieE2',
      'zombieS2',
      'zombieN2',
      'zombieW2',
      'beholderE2',
      'beholderS2',
      'beholderN2',
      'beholderW2',
      'evilKnightE2',
      'evilKnightS2',
      'evilKnightN2',
      'evilKnightW2',
    ],
    [
      'demonE1',
      'demonS1',
      'demonN1',
      'demonW1',
      'ghostE1',
      'ghostS1',
      'ghostN1',
      'ghostW1',
      'fairyE1',
      'fairyS1',
      'fairyN1',
      'fairyW1',
      'spiritE1',
      'spiritS1',
      'spiritN1',
      'spiritW1',
    ],
    [
      'demonE2',
      'demonS2',
      'demonN2',
      'demonW2',
      'ghostE2',
      'ghostS2',
      'ghostN2',
      'ghostW2',
      'fairyE2',
      'fairyS2',
      'fairyN2',
      'fairyW2',
      'spiritE2',
      'spiritS2',
      'spiritN2',
      'spiritW2',
    ],
    [
      'dogE1',
      'dogS1',
      'dogN1',
      'dogW1',
      'catTanE1',
      'catTanS1',
      'catTanN1',
      'catTanW1',
      'batE1',
      'batS1',
      'batN1',
      'batW1',
      'snakeE1',
      'snakeS1',
      'snakeN1',
      'snakeW1',
    ],
    [
      'dogE2',
      'dogS2',
      'dogN2',
      'dogW2',
      'catTanE2',
      'catTanS2',
      'catTanN2',
      'catTanW2',
      'batE2',
      'batS2',
      'batN2',
      'batW2',
      'snakeE2',
      'snakeS2',
      'snakeN2',
      'snakeW2',
    ],
    [
      'spiderE1',
      'spiderS1',
      'spiderN1',
      'spiderW1',
      'ratE1',
      'ratS1',
      'ratN1',
      'ratW1',
      'blobE1',
      'blobS1',
      'blobN1',
      'blobW1',
      'butterflyE1',
      'butterflyS1',
      'butterflyN1',
      'butterflyW1',
    ],
    [
      'spiderE2',
      'spiderS2',
      'spiderN2',
      'spiderW2',
      'ratE2',
      'ratS2',
      'ratN2',
      'ratW2',
      'blobE2',
      'blobS2',
      'blobN2',
      'blobW2',
      'butterflyE2',
      'butterflyS2',
      'butterflyN2',
      'butterflyW2',
    ],
    [
      'guyE1',
      'guyS1',
      'guyN1',
      'guyW1',
      'girlE1',
      'girlS1',
      'girlN1',
      'girlW1',
      'thiefE1',
      'thiefS1',
      'thiefN1',
      'thiefW1',
    ],
    [
      'guyE2',
      'guyS2',
      'guyN2',
      'guyW2',
      'girlE2',
      'girlS2',
      'girlN2',
      'girlW2',
      'thiefE2',
      'thiefS2',
      'thiefN2',
      'thiefW2',
    ],
    ['kingE1'],
    ['kingE2'],
    ['birdE1'],
    ['birdE2'],
    [
      'angelE1',
      'angelS1',
      'angelN1',
      'angelW1',
      'dwarfE1',
      'dwarfS1',
      'dwarfN1',
      'dwarfW1',
      'rogueE1',
      'rogueS1',
      'rogueN1',
      'rogueW1',
    ],
    [
      'angelE2',
      'angelS2',
      'angelN2',
      'angelW2',
      'dwarfE2',
      'dwarfS2',
      'dwarfN2',
      'dwarfW2',
      'rogueE2',
      'rogueS2',
      'rogueN2',
      'rogueW2',
    ],
    [
      'plantE1',
      'plantS1',
      'plantN1',
      'plantW1',
      'bugE1',
      'bugS1',
      'bugN1',
      'bugW1',
      'horseE1',
      'horseS1',
      'horseN1',
      'horseW1',
    ],
    [
      'plantE2',
      'plantS2',
      'plantN2',
      'plantW2',
      'bugE2',
      'bugS2',
      'bugN2',
      'bugW2',
      'horseE2',
      'horseS2',
      'horseN2',
      'horseW2',
    ],
    [
      'wightE1',
      'wightS1',
      'wightN1',
      'wightW1',
      'gelCubeE1',
      'gelCubeS1',
      'gelCubeN1',
      'gelCubeW1',
      'sparkleOrbE1',
      'sparkleOrbS1',
      'sparkleOrbN1',
      'sparkleOrbW1',
      'flameE1',
      'flameS1',
      'flameN1',
      'flameW1',
    ],
    [
      'wightE2',
      'wightS2',
      'wightN2',
      'wightW2',
      'gelCubeE2',
      'gelCubeS2',
      'gelCubeN2',
      'gelCubeW2',
      'sparkleOrbE2',
      'sparkleOrbS2',
      'sparkleOrbN2',
      'sparkleOrbW2',
      'flameE2',
      'flameS2',
      'flameN2',
      'flameW2',
    ],
    [
      'giantE1',
      'giantS1',
      'giantN1',
      'giantW1',
      'sentientTreeE1',
      'sentientTreeS1',
      'sentientTreeN1',
      'sentientTreeW1',
      'yetiE1',
      'yetiS1',
      'yetiN1',
      'yetiW1',
      'fliesE1',
      'fliesS1',
      'fliesN1',
      'fliesW1',
    ],
    [
      'giantE2',
      'giantS2',
      'giantN2',
      'giantW2',
      'sentientTreeE2',
      'sentientTreeS2',
      'sentientTreeN2',
      'sentientTreeW2',
      'yetiE2',
      'yetiS2',
      'yetiN2',
      'yetiW2',
      'fliesE2',
      'fliesS2',
      'fliesN2',
      'fliesW2',
    ],
    [
      'spiderRed1',
      'spiderRed2',
      'spiderBlack1',
      'spiderBlack2',
      'scorpionRed1',
      'scorpionRed2',
      'scorpionBlack1',
      'scorpionBlack2',
    ],
    [],
    [],
    [],
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'A', 'B', 'C', 'D', 'E', 'F'],
    ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'],
    ['W', 'X', 'Y', 'Z', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '='],
    ['+', '.', ',', ':', ';', '"', '<', '>', '?', '\\', '/', '|', 'mdash', 'note', 'smile', 'sad'],
    [],
    [],
    [],
    [],
    [
      'bookBrown',
      'bookBlack',
      'bookGreen',
      'keyGold',
      'keyWhite',
      'keyBlue',
      'scroll',
      'heartBlack',
      'heartRed',
      'orbBlack',
      'orbBlue',
      'skullGrey',
      'skullGold',
      'meat',
      'torch1',
      'torch2',
    ],
    [
      'potionBlue',
      'potionRed',
      'potionGreen',
      'potionGold',
      'potionBlack',
      'gemPink',
      'gemRed',
      'gemBlue',
      'gemGreen',
      'gemGold',
      'copperPile',
      'silverPile',
      'goldPile',
      'copperCoin',
      'silverCoin',
      'goldCoin',
    ],
    ['leatherHelm', 'leatherArmor', 'leatherGlove', 'leatherLeggings', 'leatherBoot'],
    ['leatherHat'],
    ['dagger'],
    ['necklace'],
    [],
    [],
    [],
    [],
    ['fireball'],
    ['fireballBlue'],
    ['fireballGreen'],
    ['fireballPurple'],
    ['eee?'],
    ['slash1'],
    ['punch1'],
    [
      'goo1',
      'goo2',
      'rain1',
      'rain2',
      'lightning1',
      'lightning2',
      'smokeo',
      'smokeoo',
      'smoke1',
      'smoke2',
      'buildingChimneyL',
    ],
  ]

  return tiles.reduce((acc, curr, y) => {
    const row = curr.reduce((rAcc, rCurr, x) => {
      const tile = { [rCurr]: [x * size, y * size] } as Record<string, [number, number]>
      return { ...rAcc, ...tile }
    }, {} as Record<string, [number, number]>)

    return { ...acc, ...row }
  }, {} as Record<string, [number, number]>)
}

export const oryxTinyMap = createOryxTinyMap(48)

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const punctuation = '!@#$%^&*()-=+.,:;"<>?\\/|-:'
const numbers = '1234567890'

// get a range of tiles in the ROT format
const mapRange = (
  chars: string,
  y: number,
  tileSize: number
): { [key: string]: [number, number] } => {
  return chars.split('').reduce((acc, curr, i) => {
    return (acc = { ...acc, [curr]: [tileSize * i, tileSize * y] })
  }, {})
}

const mapChar = (x: number, y: number, tileSize: number): [number, number] => {
  return [x * tileSize, y * tileSize]
}

const t = 32 // main tileset size
export const tileMapOryxMain = {
  ...mapRange(letters, 6, t),
  ...mapRange(letters.toLocaleLowerCase(), 6, t),
  ...mapRange(numbers, 7, t),
  ...mapRange(punctuation, 5, t),
  "'": mapChar(27, 3, t),
  ' ': mapChar(27, 0, t),
} satisfies { [key: string]: [number, number] }

export function oryxTinyFontMap(xSize: number, ySize: number) {
  const yShift = 56

  const tiles = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 '.split(''),
    '!@#$%^&*()-+=:;,"<>.?/\\[]_|\''.split(''),
  ]

  const tilesLower = ['abcdefghijklmnopqrstuvwxyz'.split('')]

  const tileKey1 = tiles.reduce((acc, curr, y) => {
    const row = curr.reduce((rAcc, rCurr, x) => {
      const tile = { [rCurr]: [x * xSize, y * ySize + yShift] } as Record<string, [number, number]>
      return { ...rAcc, ...tile }
    }, {} as Record<string, [number, number]>)

    return { ...acc, ...row }
  }, {} as Record<string, [number, number]>)

  const tileKey2 = tilesLower.reduce((acc, curr, y) => {
    const row = curr.reduce((rAcc, rCurr, x) => {
      const tile = { [rCurr]: [x * xSize, y * ySize + yShift] } as Record<string, [number, number]>
      return { ...rAcc, ...tile }
    }, {} as Record<string, [number, number]>)

    return { ...acc, ...row }
  }, {} as Record<string, [number, number]>)

  return { ...tileKey1, ...tileKey2, '~': [864, 28] } as Record<string, [number, number]>
}
