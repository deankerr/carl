const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const punctuation = '!@#$%^&*()-=+.,:;"<>?\\/|-:'
const numbers = '1234567890'

// get a range of tiles in the ROT format
const mapRange = (chars: string, y: number, tileWidth: number) => {
  return chars.split('').reduce((acc, curr, i) => {
    return (acc = { ...acc, [curr]: [tileWidth * i, y] })
  }, {})
}

const mapChar = (x: number, y: number, tileSize: number): [number, number] => {
  return [x * tileSize, y * tileSize]
}

export const tileMapOryx16 = {
  ...mapRange(letters, 96, 16),
  ...mapRange(letters.toLowerCase(), 96, 16),
  ...mapRange(punctuation, 80, 16),
  ...mapRange(numbers, 112, 16),
  ' ': mapChar(13, 0, 16),
  "'": mapChar(12, 0, 16),
}
