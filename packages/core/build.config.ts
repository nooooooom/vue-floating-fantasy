export default {
  entries: ['./src/index'],
  clean: true,
  declaration: true,
  externals: ['vue-demi'],
  rollup: {
    emitCJS: true
  }
}
