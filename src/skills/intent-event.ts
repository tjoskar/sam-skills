export interface Entity {
  entity: string
  value: string
  raw_value: string
  start: number
  raw_start: number
  end: number
  raw_end: number
  tokens: string[]
  raw_tokens: string[]
}

export interface IntentEvent {
  intent: {
    name: string,
    // Between 0 and 1 (inclusive)
    confidence: number
  },
  entities: Entity[],
  text: string,
  raw_text: string,
  recognize_seconds: number,
  tokens: string[],
  raw_tokens: string[],
  wav_seconds: number,
  transcribe_seconds: number,
  speech_confidence: number,
  wakeId: string,
  siteId: string,
  slots: Record<string, string>
}
