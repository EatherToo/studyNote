import Link from './router-link'
import View from './router-view'

let Vue;

function VueRouter(options) {
  // 保存选项
  this.$options = options;

  // 保存router信息
  this.routeMap = {};
  this.$options.routes.forEach(route => {
    this.routeMap[route.path] = route;
  })

  // 定义响应式的属性
  const initial = window.location.hash.slice(1) || '/';
  Vue.util.defineReactive(this, 'current', initial);

  // 监听hashchange事件来实现路由的切换
  window.addEventListener('hashchange', onHashChange.bind(this));
  window.addEventListener('load', onHashChange.bind(this));
}

function onHashChange () {
  this.current = window.location.hash.slice(1);
}
// 实现install方法
VueRouter.install = function (_Vue) {
  // 保存Vue的构造函数
  Vue = _Vue;

  // 挂载router到Vue的原型上面
  Vue.mixin({
    beforeCreate() {
      // 只有根组件拥有router选项
      if (this.$options.router) {
        // vm.$router
        Vue.prototype.$router = this.$options.router;
      }
    }
  });

  // 任务2：实现两个全局组件router-link和router-view
   Vue.component('router-link', Link)
   Vue.component('router-view', View)
};
export default VueRouter;