// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      '.gitignore',
      'packages/core/src/utils/diff.ts',
      'packages/cli/test/suites',
      'packages/core/test/suites',
    ],
  },
  {
    rules: {
      // overrides
    },
  },
)
