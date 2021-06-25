import { isStr, updateNode } from '../utils/utils.js'

export function updateHostComponent(wip) {
  // 更新节点自己
  if (!wip.stateNode) {
    wip.stateNode = createNode(wip)
  }
  reconcileChildren(node, props.children)
  // 协调子节点
}


function createNode(vnode) {
  const { type, props } = vnode
  const node = document.createElement(type)
  console.log('props', props)
  updateNode(node, props)
  reconcileChildren(node, props.children)
  return node
}

function reconcileChildren(parantNode, children) {
  if (isStr(children)) {
    return
  }
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    // child vode
    // child->node
    // node -> parentnode
    render(child, parantNode)
  }
}
