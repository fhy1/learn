import { NoFlags, Placement , Update ,Deletion } from '../utils/utils.js'

export function createFiber(vnode, returnFiber) {
  const fiber = {
    type: vnode.type, // 节点类型
    key: vnode.key, //当前层级下的唯一
    props: vnode.props,
    child: null, // 第一个子节点
    sibling: null, // 下一个兄弟节点
    return: returnFiber, // 父fiber
    index: 0, //当前层级下的位置
    stateNode: null, // dom节点 || 类实例
    flags: Placement, // 标记fiber 是插入、更新、删除
  }
  return fiber
}