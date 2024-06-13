export function isFileURL(path: string): boolean {
  const fileURLRegex = /^file:\/\//
  return fileURLRegex.test(path)
}
