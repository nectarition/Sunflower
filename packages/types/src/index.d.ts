export interface SoleilSession {
  name: string
}

export interface SoleilCircle {
  name: string
  space: string
  status?: SoleilCircleStatus
}
export type SoleilCircleAppModel = SoleilCircle & {
  updatedAt: number
}
export type SoleilCircleDbModel = SoleilCircle & {
  updatedAt: object
}

/**
 * 出欠ステータス
 * 0: 未提出
 * 1: 出席
 * 2: 欠席
 */
export type SoleilCircleStatus = 0 | 1 | 2

/**
 * 出席登録の処理結果ステータス
 * 1: 成功, 2: エラー
 */
export type RollCallProcessStatus = 1 | 2
