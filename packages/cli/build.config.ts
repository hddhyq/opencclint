import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index.ts',
  ],
  declaration: false,
  failOnWarn: false,
  rollup: {
    emitCJS: false,
    dts: {
      compilerOptions: {
        paths: {},
      },
    },
  },
})
