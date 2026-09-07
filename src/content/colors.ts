export type BeadColor = 'pink' | 'orange' | 'yellow' | 'purple' | 'green'

export interface ColorInfo {
  id: BeadColor
  label: string
  hex: string
  defaultGrowth: number
}

export const COLORS: ColorInfo[] = [
  { id: 'pink', label: 'Pink', hex: '#ff6eb4', defaultGrowth: 1 },
  { id: 'orange', label: 'Orange', hex: '#ff8c1a', defaultGrowth: 1 },
  { id: 'yellow', label: 'Yellow', hex: '#f5d90a', defaultGrowth: 2 },
  { id: 'purple', label: 'Purple', hex: '#a855f7', defaultGrowth: 2 },
  { id: 'green', label: 'Green', hex: '#22c55e', defaultGrowth: 3 },
]

export const COLOR_IDS = COLORS.map((c) => c.id)

export function colorHex(id: BeadColor): string {
  return COLORS.find((c) => c.id === id)!.hex
}

export function colorLabel(id: BeadColor): string {
  return COLORS.find((c) => c.id === id)!.label
}
