// 1.实现响应式
function defineReactive(obj, key, val) {
  observe(obj[key])
  Object.defineProperty(obj, key, {
    get() {
      console.log('get', val)
      return val
    },
    set(v) {
      console.log('key:', key, 'value:', v)

      if (typeof v === 'object') {
        observe(v)
      }
      if(v !== val) {
        val = v
      }
    }
  })
}

function observe(obj) {
  // 如果obj不是对象
  if (typeof obj !== 'object') {
    return
  }
  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key, obj[key])
  })
}

function set(obj, key, val) {
  defineReactive(obj, key, val)
}

// const obj = {
//   a: '1',
//   b: {
//     c: '2',
//     d: {
//       f: '3'
//     }
//   }
// }

// observe(obj)

// obj.a = 3
// obj.b.c = 6

function proxy(vm) {
  Object.keys(vm.$data).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key]
      },
      set(v) {
        vm.$data[key] = v
      }
    })
  })
}


class _Vue {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    observe(this.$data)
    proxy(this)
    const compile = new Compile(options.el, this)
  }
}

class Compile {
  constructor(el, vm) {
    this.$vm = vm
    this.compile(document.querySelector(el))
  }

  compile(el) {
    el.childNodes.forEach(node => {
      if(node.nodeType === 1) {
        // 元素
        this.compile(node)
      } else if(this.isInter(node)) {
        // 插值文本
        const prop = RegExp.$1
        const propValue = this.$vm[prop]
        if (propValue !== undefined) {
          node.textContent = node.textContent.replace(/\{\{(.*)\}\}/, propValue)
        }
      }
    })
  }

  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }

}