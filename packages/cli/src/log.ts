import process from 'node:process'
import chalk from 'chalk'
import type { TranslateResult } from '../../core/src'

// Helper function to format time cost
function formatTimeCost(startTime: [number, number]): string {
  const timeDiff = process.hrtime(startTime)
  const timeCost = (timeDiff[0] * 1000 + timeDiff[1] / 1000000).toFixed(3)
  return chalk.gray(`Time cost: ${timeCost}ms`)
}

export function logResult(result: TranslateResult, time: [number, number]) {
  const timeCost = formatTimeCost(time)
  const title = chalk.green('OpenccLint result:')
  const errors = result.diffs.map(diff => ({
    title: chalk.white.underline(diff.file),
    positions: diff.positions.map(position =>
      `${chalk.gray(`${position.line}:${position.column}`)}${chalk.red(' error ')}${diff.original.substring(position.start, position.end)} => ${diff.modified.substring(position.start, position.end)}`,
    ),
  }))
  const errorCount = result.errorCount
    ? chalk.red(`✖ Total error count: ${result.errorCount}`)
    : chalk.green('No error found!')
  const formattedErrors = errors.map(error => `
${error.title}

${error.positions.join('\n')}
`).join('\n')

  let output = ''
  if (!result.errorCount) {
    output = `
${title}

${chalk.green('No error found!')}

${timeCost}
    `
  }
  else {
    output = `
${title}
${formattedErrors}
${errorCount}
${timeCost}
✨ Recommend to use --fix to fix the errors.
`
  }

  // eslint-disable-next-line no-console
  console.log(output)
  process.exit(result.errorCount ? 1 : 0)
}

/**
 * Logs the success message after fixing errors with OpenccLint.
 * @param result - The TranslateResult object containing the fixed errors.
 * @param time - The time taken to fix the errors.
 */
export function logSuccess(result: TranslateResult, time: [number, number]) {
  const timeCost = formatTimeCost(time)
  const title = chalk.green('OpenccLint fix success!')
  const errorCount = chalk.green(`✅ Total error fixed count: ${result.errorCount}`)
  const errorFiles = result.diffs.map(diff => chalk.white.underline(diff.file)).join('\n')

  let output = ''

  if (!result.errorCount) {
    output = `
${title}

${chalk.green('No error found!')}

${timeCost}
    `
  }
  else {
    output = `
${title}

${errorFiles}

${errorCount}
${timeCost}
    `
  }
  // eslint-disable-next-line no-console
  console.log(output)
}
