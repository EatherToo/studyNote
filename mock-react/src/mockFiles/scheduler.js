// 过期时间
let expirationTime = 0;
// 时间切片
const threshould = 5; // 源码中交timeout

// 没有过期的任务
const timerQueue = [];
// 任务队列
const taskQueue = [];



export function scheduleCallback(callback) {
  // 新建任务
  const newTask = {callback};
  taskQueue.push(newTask);
  // 调度任务
  schedule(flushWork);
}

export function schedule(callback) {
  timerQueue.push(callback);
  postMessage();
}

// 执行timerQueue中的任务
function postMessage() {
  const {port1, port2} = new MessageChannel();
  port1.onmessage = () => {
    // 取出timer queue中的人物去除出来，执行一遍
    let tem = timerQueue.splice(0, timerQueue.length);
    tem.forEach(t => t());
  }
  port2.postMessage(null);
}

// 处理更新
function flushWork() {
  // 过期时间为当前时间加时间切片
  expirationTime = getCurrentTime() + threshould;
  let currentTask = taskQueue[0];
  // 当前任务存在且没有超时
  while(currentTask && !shouldYield()) {
    const {callback} = currentTask;
    // 执行任务
    callback();
    // 任务出队
    taskQueue.shift();
    // 更新当前任务
    currentTask = taskQueue[0]
  }
}

export function shouldYield() {
  return getCurrentTime() >= expirationTime;
}

function getCurrentTime() {
  return performance.now();
}