export interface DailyWriting {
  id: string
  text: string
  created: string
}

export interface WritingSettings {
  activeWritingId: string
  dailyGoal: number
}
