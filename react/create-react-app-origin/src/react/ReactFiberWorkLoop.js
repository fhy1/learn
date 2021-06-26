// work in progress; 当前正在工作中的 wip

import { isStr } from "../utils/utils";
import {updateHostComponent} from './ReactFiberReconcile.js'

let wipRoot = null
let nextUnitofWork = null;


export function scheduleUpdateOnFiber(fiber) {
  wipRoot = fiber
  wipRoot.sibling = null;
  nextUnitofWork = wipRoot;
}

function performUnitOfWork(wip) {
  // 更新当前任务
  const { type } = wip;
  if (isStr(type)) {
    updateHostComponent(wip);
  }
  // 
  // 2.返回下一个任务
  if (wip.child) {
    return wip.child;
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
    if (!nextUnitofWork) {
      // commotRoot();
    }
  }
}


requestIdleCallback(workLoop)