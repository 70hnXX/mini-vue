const {
  resolve
} = require('path')
const {
  build
} = require('esbuild')
// 获取参数，以node scripts/dev.js reactivity -f global 为例解析
const args = require('minimist')(process.argv.slice(2));

// 获取参数中的target
const target = args._[0] || 'reactivity'; // reactivity
// 获取参数中的formate参数
const format = args.f || 'global'; // global
// 开发环境只打包某一个模块
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))


// iife:立即执行函数（function{}()）；cjs node中的模块；esm:浏览器中的esmodule模块
const outputFormat = format.startsWith('global') ? 'iife' : format === 'cjs' ? 'cjs' : 'esm'

// 定义打包后的文件名和路径
const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`)

// 执行打包
build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile,
  bundle: true, // 把所有的包打包到一起
  sourcemap: true,
  format: outputFormat, // 输出的格式
  globalName: pkg.buildOptions.name, // 打包的全局的名字
  platform: format === 'cjs' ? 'node' : 'browser', // 平台
  watch: { // 监控文件变化
    onRebuild(error) {
      if (!error) {
        console.log('rebuild~~~')
      }
    }
  }
}).then(() => {
  console.log('watching~~~')
})