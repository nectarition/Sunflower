export type LoggedInUser = {
  name: string
}

export type AuthenticateResult = {
  token: string
}

export type LoginResult = {
  token: string
  user: LoggedInUser
}

export interface SoleilSession {
  name: string
}

export interface SessionState {
  sessionCode: string
  session: SoleilSession
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

export type User = {
  id: number
  name: string
  email: string
  emailVerified: boolean
  createdAt: Date
}

export type SuccessResult = {
  success: boolean
}
