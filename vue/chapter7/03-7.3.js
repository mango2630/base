function createRenderer(options) {
  const {
    createElement,
    insert,
    setElementText,
  } = options;
  function mountElement(vnode, container) {
    // 创建 DOM 元素
    const el = createElement(vnode.type);
    // 处理子节点
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children);
    }
    insert(el, container);
  }

  function patch(oldVNode, newVNode, container){
    // 编写渲染逻辑
    if(!oldVNode) { // 首次渲染挂载
      mountElement(newVNode, container);
    } else { // 打补丁

    }
  };

  function render(vnode, container) {
    if(vnode) {
      patch(container._vnode, vnode, container);
    } else {
      if (container._vnode) {
        container.innerHTML = ''
      }
      container._vnode = vnode;
    }
  };
  
  function hydrate(vnode, container) {};
  return {
    render,
    hydrate,
  }
}
const operationObj = {
  // 创建元素
  createElement(tag) {
    return document.createElement(tag);
  },
  // 设置元素文本节点
  setElementText(el, text)  {
    el.textContent = text;
  },
  // 用于在指定的 parent 下添加元素
  insert(el, parent, anchor = null) {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Node/insertBefore
    parent.insertBefore(el, anchor);
  }
}
const renderer = createRenderer(operationObj);

const vnode = {
  type: 'h1',
  children: 'hello',
}
renderer.render(vnode, document.getElementById('app'));