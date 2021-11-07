import { Placement } from './utils';

/**
* fiber:
* type 标记节点类型
* key 标记节点在当前层级下的唯一性
* props 属性
* index 标记当前层级下的位置
* child 第一个子节点
* sibling 下一个兄弟节点
* return 父节点
* stateNode 如果组件是原生标签则是dom节点，如果是类组件则是类实例
*/
export function createFiber(vnode, returnFiber) {
  const newFiber = {
    type: vnode.type,
    key: vnode.key,
    props: vnode.props,
    stateNode: null,
    child: null,
    return: returnFiber,
    sibling: null,
    alternate: null,
    flags: Placement
  }
  return newFiber;
}