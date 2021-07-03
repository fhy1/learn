// work in progress; 当前正在工作中的 wip

import { isStr, isFn } from '../utils/utils'
import {
  updateHostComponent,
  updateFuncionComponent,
} from './ReactFiberReconcile.js'

let wipRoot = null
let nextUnitofWork = null;


export function scheduleUpdateOnFiber(fiber) {
  console.log(fiber)
  wipRoot = fiber
  wipRoot.sibling = null;
  nextUnitofWork = wipRoot;
}

function performUnitOfWork(wip) {
  // 更新当前任务
  const { type } = wip;
  if (isStr(type)) {
    updateHostComponent(wip);
  } else if (isFn(type)) {
    updateFuncionComponent(wip)
  }
  
  if (wip.child) {
    //
    // 2.返回下一个任务
    return wip.child
  }
  let next = wip;
  while (next) {
    if (next.sibling) {
      return next.sibling
    }
    next = next.return;
  }
  return null;
}

function workLoop(IdleDeadline) {
  while (nextUnitofWork && IdleDeadline.timeRemaining() > 0) {
    // 1.更新当前任务 2.返回下一个任务
    nextUnitofWork = performUnitOfWork(nextUnitofWork)

    //
    if (!nextUnitofWork && wipRoot) {
      commotRoot();
    }
  }
}


requestIdleCallback(workLoop)


function commotRoot() {
  commitWorker(wipRoot.child)
}

function commitWorker(wip) {
  if (!wip) {
    return
  }
  // 1.更新自己
  // v-node => node
  const { stateNode } = wip;
  // parentNode 就是父dom节点
  let parentNode = wip.return.stateNode
  if (stateNode) {
    parentNode.appendChild(stateNode)
  }

  // 2.更新子节点
  commitWorker(wip.child)
  // 3.更新兄弟
  commitWorker(wip.sibling)
}