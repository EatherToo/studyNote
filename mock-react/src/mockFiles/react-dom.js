import { scheduleUpdateOnFiber } from './ReactFiberWorkloop'

function render(element, container) {
  const FiberRoot = {
    type: container.nodeName.toLocaleLowerCase(), // 类型
    props: {children: element}, // 子节点
    stateNode: container, // 根结点
  }

  // 处理节点更新
  scheduleUpdateOnFiber(FiberRoot);
}
const reactDom = {render}
export default reactDom;