// import { isStr, updateNode } from '../utils/utils.js'
import {scheduleUpdateOnFiber} from './ReactFiberWorkLoop.js'

function render(vnode, container) {
  // vnode（host原生标签）->node
  // 把node 更新到container
  console.log("vnode", vnode)
  const fiberRoot = {
    type: container.nodeName.toLocaleLowerCase(),
    stateNode: container,
    props: {
      children: vnode.props.children,
    },
  }

  scheduleUpdateOnFiber(fiberRoot);
  // react 早期版本的操作
  // const node = createNode(vnode)
  // container.appendChild(node);
}

// function createNode (vnode) {
//   const { type, props } = vnode;
//   const node = document.createElement(type);
//   console.log('props', props)
//   updateNode(node, props)
//   reconcileChildren(node, props.children)
//   return node
// }

// function reconcileChildren(parantNode, children) {
//   if (isStr(children)) {
//     return
//   }
//   for (let i = 0; i < children.length; i++) {
//     const child = children[i]
//     // child vode
//     // child->node
//     // node -> parentnode
//     render(child, parantNode)
//   }
// }

// eslint-disable-next-line import/no-anonymous-default-export
export default { render };