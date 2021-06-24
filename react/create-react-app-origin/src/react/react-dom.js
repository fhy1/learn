import { isString } from '../utils/utils.js'

function render(vnode, container) {
  // vnode->node
  // 把node 更新到container
  console.log("vnode", vnode)
  const node = createNode(vnode)
  container.appendChild(node);
}

function createNode (vnode) {
  const { type, props } = vnode;
  const node = document.createElement(type);
  reconcileChildren(node, props.children)
  return node
}

function reconcileChildren(parantNode, children) {
  if (isString(children)) {
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

// eslint-disable-next-line import/no-anonymous-default-export
export default { render };