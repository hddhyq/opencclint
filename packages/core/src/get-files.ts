import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { isTextPath } from './utils'
import { getIsIgnored } from './ignored-patterns'

/**
 * Recursively get all files in given directories, excluding ignored files.
 * @param {string[]} files - Initial array of files or directories to process.
 * @param {string} [baseDir] - Base directory to resolve relative paths.
 * @returns {Promise<string[]>} - A Promise that resolves to an array of file paths.
 */
export async function getFiles(files: string[], baseDir = process.cwd()): Promise<string[]> {
  const resultFiles = []

  for (const file of files) {
    const fullPath = path.resolve(baseDir, file)
    const stats = await fs.stat(fullPath)

    if (getIsIgnored(path.basename(fullPath)))
      continue

    if (stats.isDirectory()) {
      const subFiles = await fs.readdir(fullPath)
      const subPaths = subFiles.map(subFile => path.join(fullPath, subFile))
      const filesFromDir = await getFiles(subPaths, baseDir)

      resultFiles.push(...filesFromDir.filter(isTextPath))
    }
    else {
      isTextPath(fullPath) && resultFiles.push(fullPath)
    }
  }

  return resultFiles
}
