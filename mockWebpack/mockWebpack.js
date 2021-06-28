const fs = require("fs")
const path = require("path")
const parser = require("@babel/parser")
const traverse = require("@babel/traverse").default
const babel = require("@babel/core")

/**
 * 获取模块信息
 * @param {string} file 文件地址
 */
function getModuleInfo(file) {
  // 读取文件
  const body = fs.readFileSync(file, "utf-8")

  // 转换成ast语法树
  const ast = parser.parse(body, {
    sourceType: "module"
  })

  // 依赖收集
  const deps = {}
  traverse(ast, {
    ImportDeclaration({node}) {
      const dirname = path.dirname(file);
      const absPath = "./" + path.join(dirname, node.source.value);
      deps[node.source.value] = absPath;
    }
  })


  const {code} = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"]
  })
  // console.log(code)
  const moduleInfo = {file, deps, code}
  return moduleInfo;
}

// getModuleInfo('./test/src/index.js')

/**
 * 递归收集依赖, 将所有依赖扁平化
 * @param {Array} depArray 存放依赖的数组
 * @param {Object} parentDeps 父级依赖
 */
function getDeps(depArray, parentDeps) {
  Object.keys(parentDeps).forEach(key => {
    const child = getModuleInfo(parentDeps[key])
    depArray.push(child);
    getDeps(depArray, child.deps)
  })
}

/**
 * 模块解析
 * @param {string} file 
 */
function parseModules(file) {
  const entry = getModuleInfo(file)
  const depArray = [entry]
  const depsGraph = {}
  getDeps(depArray, entry.deps)
  depArray.forEach(moduleInfo => {
    depsGraph[moduleInfo.file] = {
      deps: moduleInfo.deps,
      code: moduleInfo.code,
    }
  })
  console.log(depsGraph)
  return depsGraph
}

parseModules('./test/src/index.js')

function bundle(file) {
  const depsGraph = parseModules(file);
  console.log(depsGraph)
  const depsGraphFuncStr = Object.keys(depsGraph).reduce((preRes, curKey) => {

    preRes += `"${curKey}": {code: function(require, exports) {
      ${depsGraph[curKey].code}
    },
    deps: ${JSON.stringify(depsGraph[curKey].deps)},
  },\n`
    return preRes
  }, '')

  return `(function (graph) {
        function require(file) {
            function absRequire(relPath) {
                return require(graph[file].deps[relPath])
            }
            var exports = {};
            (function (require,exports,code) {
                code(require, exports);
            })(absRequire,exports,graph[file].code)
            return exports
        }
        require('${file}')
    })({
      ${depsGraphFuncStr}
    })`;
}

const content = bundle('./test/src/index.js')

!fs.existsSync("./dist") && fs.mkdirSync("./dist")
fs.writeFileSync("./dist/bundle.js", content)
