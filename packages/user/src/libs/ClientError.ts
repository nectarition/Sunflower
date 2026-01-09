export class ClientError extends Error {
  reason: string
  
  constructor(reason: string, message: string) {
    super(message)
    this.name = 'ClientError'
    this.reason = reason
  }
}
