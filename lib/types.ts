export type Match = {
  index: number
  value: string
}

export type SavedPattern = {
  name: string
  regex: string
  flags: string
}

export type State = {
  regex: string
  flags: string
  text: string
  isValid: boolean
  matches: Match[]
  error: string | null
  savedPatterns: SavedPattern[]
  selectedPattern: string
  patternName: string
  executionTime: number | null
  regexHistory: string[]
}
