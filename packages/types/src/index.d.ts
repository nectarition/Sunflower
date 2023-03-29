export interface SunflowerSession {
  name: string
}

export interface SunflowerCircle {
  name: string
  space: string
  status?: SunflowerCircleStatus
}

export type SunflowerCircleStatus = 0 | 1 | 2

export type valueOf<T> = T[keyof T]
