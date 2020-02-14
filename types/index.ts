export interface DailyWriting {
  id: string
  text: string
  dateCreated: number
}

export interface WritingSettings {
  activeWritingId: string
  dailyGoal: number
}
