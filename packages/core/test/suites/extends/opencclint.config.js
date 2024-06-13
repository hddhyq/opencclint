const path = require('node:path')

const extendsNestedConfigPath = path.resolve(__dirname, '../extendsNested/opencclint.config.json')

module.exports = {
  extends: [extendsNestedConfigPath],
  ignoreWords: ['台'],
  exclude: [
    'dist',
  ],
}
