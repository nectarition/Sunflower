export interface SunflowerSession {
  name: string
}

export interface SunflowerCircle {
  name: string
  space: string
  status?: SunflowerCircleStatus
}
export type SunflowerCircleAppModel = SunflowerCircle & {
  updatedAt: number
}
export type SunflowerCircleDbModel = SunflowerCircle & {
  updatedAt: object
}

/**
 * 出欠ステータス
 * 0: 未確認
 * 1: 出席
 * 2: 欠席
 */
export type SunflowerCircleStatus = 0 | 1 | 2
