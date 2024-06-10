export interface SunflowerSession {
  name: string
}

export interface SunflowerCircle {
  name: string
  space: string
  status?: SunflowerCircleStatus
}

/**
 * 出欠ステータス
 * 0: 未確認
 * 1: 出席
 * 2: 欠席
 */
export type SunflowerCircleStatus = 0 | 1 | 2

export type valueOf<T> = T[keyof T]
