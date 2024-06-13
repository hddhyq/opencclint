import process from 'node:process'
import cac from 'cac'
import ora from 'ora'
import { version } from '../package.json'
import { applyTranslationFixes, translateFiles } from '../../core/src'
import { initConfig } from './config'
import { logResult, logSuccess } from './log'
import type { Options } from './config'

const cli = cac('opencclint')

cli.option('-c, --config <path>', 'Path to configuration file.')
cli.option('-e, --exclude <patterns>', 'Patterns to exclude words. split by comma. E.g.台,台湾.')
cli.option('-i, --ignore <patterns>', 'Patterns to ignore files or directories.')
cli.option('-t, --translate <from2to>', 'Translate content from one format to another. E.g., cn=>tw.')
cli.option('--fix', 'Fix the lint errors.')

cli.command('[...files]', 'Lint files').action(async (files, options: Options) => {
  const ocInstance = await initConfig(options)

  if (process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line no-console
    console.log(files, ocInstance)
  }

  const startTime = process.hrtime()
  const spinner = ora('Opencclint Translating files...').start()
  const result = await translateFiles({ files, config: ocInstance.getConfig() })
  if (options.fix) {
    await applyTranslationFixes(result)
    logSuccess(result, startTime)
  }
  else {
    logResult(result, startTime)
  }
  spinner.stop()
})

cli.version(version)
cli.help()

cli.parse()
