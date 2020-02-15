export interface DailyWriting {
  id: string
  text: string
  created: number
}

export interface WritingSettings {
  activeWritingId: string
  dailyGoal: number
}
