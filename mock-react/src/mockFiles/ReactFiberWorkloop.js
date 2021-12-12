import { Component } from 'react';
import { updateClassComponent, updateFunctionComponent, updateHostComponent } from './ReactFiberReconciler';
import { scheduleCallback, shouldYield } from './scheduler';
import { isFn, isStr } from './utils';


// wip work in progress

let wipRoot = null;
// 下一个fiber节点
let nextUnitOfWork = null;

export function scheduleUpdateOnFiber(fiber) {
   wipRoot = fiber;
   wipRoot.sibling = null;
   nextUnitOfWork = wipRoot;
   scheduleCallback(workLoop);
}


function performUnitOfWork(wip) {
  // 1. 更新wip todo
  const {type} = wip;
  // 原生组件
  if (isStr(type)) {
    updateHostComponent(wip);
  } else if (type.prototype?.__proto__ === Component.prototype){
    updateClassComponent(wip)
  } else if (isFn(type)) {
    // 函数组件
    updateFunctionComponent(wip);
  }
  // 2. 返回下一个要更新的任务
  
  if(wip.child) { // 存在子节点
    return wip.child;
  }
  
  // 深度优先遍历寻找下一个要更新的任务
  let next = wip;
  while(next) {
    if (next.sibling) { // 先找兄弟节点
      return next.sibling;
    }
    // 没有兄弟节点了往前遍历
    next = next.return;
  }
  return null;

}

function workLoop(IdleDeadline) {
  // 当前有空闲时间
  while (nextUnitOfWork && !shouldYield()) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
}

// requestIdleCallback(workLoop);

function commitRoot() {
  commitWorker(wipRoot.child);
  wipRoot = null;
}

function commitWorker(wip) {
  if(!wip) {
    return
  }
  // 1. 提交自己
  const {stateNode} = wip;
  let parentNode = getParentNode(wip);
  
  if (stateNode) {
    parentNode.appendChild(stateNode);
  }
  
  // 2. 提交子节点
  commitWorker(wip.child);
  // 3. 提交兄弟节点
  commitWorker(wip.sibling);
}

function getParentNode(fiber) {
  while(fiber) {
    if (fiber.return.stateNode) {
      return fiber.return.stateNode;
    }
    fiber = fiber.return;
  }
  return null;
}