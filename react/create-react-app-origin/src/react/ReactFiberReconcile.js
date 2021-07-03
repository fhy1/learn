import { isStr, updateNode, isArray } from '../utils/utils.js'
import { createFiber } from './fiber.js'

export function updateHostComponent(wip) {
  // 更新节点自己
  if (!wip.stateNode) {
    wip.stateNode = createNode(wip)
  }
  reconcileChildren(wip, wip.props.children)
  // 协调子节点

  console.log('wip', wip)
}

export function updateFuncionComponent(wip) {
  // 更新节点自己

  // 协调子节点
  const { type, props } = wip
  const children = type(props)
  reconcileChildren(wip, children)
}



function createNode(vnode) {
  const { type, props } = vnode
  const node = document.createElement(type)
  // console.log('props', props)
  updateNode(node, props)
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
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i]
    const newFiber = createFiber(newChild, wip)
    if (previousNewFiber === null) {
      wip.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber
    }
    previousNewFiber = newFiber
  }
}