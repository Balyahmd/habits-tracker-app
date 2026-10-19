export type FlashTone = 'success' | 'error' | 'warning'

export type Flash = {
  tone: FlashTone
  message: string
}
