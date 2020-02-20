export interface DailyWriting {
  id: string
  text: string
  created: string
}

export interface WritingSettings {
  activeWritingId: string
  dailyGoal: number
}

export interface Action {
  [name: string]: (cm: any) => void;
}

export interface ExtraKeys {
  [hotKey: string]: (cm: any) => void;
}

export interface KeyMap {
  [hotKey: string]: string;
}