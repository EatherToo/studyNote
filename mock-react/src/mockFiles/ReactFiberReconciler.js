import { createFiber } from './createFiber';
import { isStr, updateNode } from './utils';

// 更新原生组件
export function updateHostComponent(wip) {
  if(!wip.stateNode) {
    // 创建原生节点
    wip.stateNode = document.createElement(wip.type);
    console.log(wip.props)
    updateNode(wip.stateNode, {}, wip.props);
  }
  reconcileChildren(wip, wip.props.children);
  
}
/**
 * 更新函数组件
 * @param {Fiber} wip 
 */
export function updateFunctionComponent(wip) {
  const {type, props} = wip;
  const child = type(props);
  reconcileChildren(wip, child);
}

export function updateClassComponent(wip) {
  const {type, props} = wip;
  const child = new type(props);
  reconcileChildren(wip, child.render());
}

function reconcileChildren(returnFiber, children) {
  // 文本节点直接返回
  if (isStr(children)) {
    return;
  }
  const newChildren = Array.isArray(children) ? children : [children];
  // 前一个节点
  let previosNewFiber = null;
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    // 创建新的fiber节点
    const newFiber = createFiber(newChild, returnFiber)
    // 是第一个节点
    if (i === 0) {
      returnFiber.child = newFiber;
    } else {
      // 非第一个节点指向sibling
      previosNewFiber.sibling = newFiber;
    }

    // 记录前一个节点的指针
    previosNewFiber = newFiber;
    
  }
}