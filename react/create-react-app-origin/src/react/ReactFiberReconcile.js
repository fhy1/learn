import { isStr, updateNode, isArray, Update } from '../utils/utils.js'
import { createFiber } from './fiber.js'
import { renderHooks } from './hooks.js'

export function updateHostComponent(wip) {
  // 更新节点自己
  if (!wip.stateNode) {
    wip.stateNode = createNode(wip)
  }

  // 协调子节点
  reconcileChildren(wip, wip.props.children)
}

export function updateFuncionComponent(wip) {
  // 更新节点自己
  renderHooks(wip)
  // 协调子节点
  const { type, props } = wip
  const children = type(props)
  reconcileChildren(wip, children)
}



function createNode(vnode) {
  const { type, props } = vnode
  const node = document.createElement(type)
  // console.log('props', props)
  updateNode(node, {}, props)
  // reconcileChildren(node, props.children)
  return node
}

// 初次渲染、更新
// 更新新的fiber结构的过程
function reconcileChildren(wip, children) {
  if (isStr(children)) {
    return
  }
  const newChildren = isArray(children) ? children : [children]
  let previousNewFiber = null;
  let oldFiber = wip.alternate && wip.alternate.child
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i]
    if (newChild === null) {
      continue;
    }
    const newFiber = createFiber(newChild, wip)
    const same = sameNode(oldFiber, newFiber)
    if (same) {
      Object.assign(newFiber, {
        alternate: oldFiber,
        stateNode: oldFiber.stateNode,
        flags: Update
      })
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (previousNewFiber === null) {
      wip.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber
    }
    previousNewFiber = newFiber
  }
}

function sameNode (a, b) {
  return !!(a && b && (a.type === b.type) && (a.key === b.key));
}