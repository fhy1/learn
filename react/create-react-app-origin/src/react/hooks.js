// hook = {
//   memoizedState 状态值
//   next 下一个hook
// }

import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

// 当前正在渲染的fiber
let currentlyRenderingFiber = null
let workInProgressHook = null
function udateWorkInProgressHook() {
  let hook;
  const current = currentlyRenderingFiber.alternate;
  if (current) {
    // 更新阶段
    // 在老的hook进行更新
    // 从老的fiber上找到hook 更新到新的fiber上
    currentlyRenderingFiber.memoizedState = current.memoizedState;
    if (workInProgressHook) {
      // 不是第0个
      hook = workInProgressHook = workInProgressHook.next
    } else {
      // 第0个hook
      hook = workInProgressHook = current.memoizedState;
    }
  } else {
    // 初次渲染
    hook = {
      memoizedState: null,
      next: null
    }

    if (workInProgressHook) {
      // 不是第0个
      workInProgressHook = workInProgressHook.next = hook
    } else {
      // 第0个hook
      workInProgressHook = currentlyRenderingFiber.memoizedState = hook
    }
  }
  // 判断初次渲染还是更新
  return hook;
}

export function useReducer(reducer, initalState) {
  const hook = udateWorkInProgressHook()
  if (!currentlyRenderingFiber.alternate) {
    hook.memoizedState = initalState
  }
  const dispatch = (action) => {
    // 计算状态值
    hook.memoizedState = reducer(hook.memoizedState, action)
    scheduleUpdateOnFiber(currentlyRenderingFiber)
  }

  return [hook.memoizedState, dispatch];
}

export function renderHooks(wip) {
  currentlyRenderingFiber = wip;
  currentlyRenderingFiber.memoizedState = null; //  第0个hook 头结点
  workInProgressHook = null
}