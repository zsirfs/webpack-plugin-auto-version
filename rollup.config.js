import eslint from 'rollup-plugin-eslint'
import uglify from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'cjs'
    },
    plugins: [
      resolve(),
      commonjs({
        include: 'node_modules/**',
        exclude: ['src/**']
      }),
      eslint(),
      babel(),
      uglify()
    ],
    external: ['fs', 'os', 'path', 'yargs', 'semver', 'rimraf', 'node-notifier']
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.common.js',
      format: 'cjs'
    },
    plugins: [
      resolve(),
      commonjs({
        include: 'node_modules/**',
        exclude: ['src/**']
      }),
      eslint(),
      babel()
    ],
    external: ['fs', 'os', 'path', 'yargs', 'semver', 'rimraf', 'node-notifier']
  }
]
