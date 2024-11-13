const MyComponent1 = function() {
  return {
    tag: 'div',
    props: {},
    children: 'click me'
  }
}

const MyComponent = {
  renderer() {
    return {
      tag: 'div',
      props: {},
      children: 'click me'
    }
  }
}



const vnode = {
  tag: MyComponent,
  props: {},
  children: {}
}

function renderer(vnode, container) {
  if (typeof vnode.tag === 'string') { // 标签
    mountElement(vnode, container);
  } else if (typeof vnode.tag === 'function') { // 组件
    mountComponent(vnode, container);
  }
}

function mountComponent(vnode, container) {
  const subTree = vnode.tag(); // 因为组件是一个函数，需要调用
  renderer(subTree, container);
}

function mountElement(vnode, container) { // 待实现

}