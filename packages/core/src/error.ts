export class OpencclintError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'OpencclintError'
  }
}
