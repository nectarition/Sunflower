export type LoggedInUser = {
  name: string
}

export type AuthenticateResult = {
  token: string
}

export type LoginResult = {
  token: string
  passwordResetToken: string | null
  user: LoggedInUser
}

export interface SoleilEvent {
  code: string
  name: string
  organization: SoleilOrganization
  date: Date
}

export interface SoleilCircle {
  name: string
  spaceNumber: string
  status?: SoleilCircleStatus
}
export type SoleilCircleAppModel = SoleilCircle & {
  updatedAt: number | null
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

export type SoleilOrganization = {
  name: string
}

export type SuccessResult = {
  success: boolean
}
