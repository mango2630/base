function createRenderer(options) {
  const {
    createElement,
    insert,
    setElementText,
    patchProps,
  } = options;

  function mountElement(vnode, container) {
    // 创建 DOM 元素
    const el = vnode.el = createElement(vnode.type);
    // 处理子节点
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children);
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach( child => {
        patch(null, child, el); // 因为是 mount 挂载阶段，所以第一个参数为 null, 无 oldVNode
      })
    }
    // 处理属性
    if (vnode.props) {
      for (const key in vnode.props) {
        patchProps(el, key, null, vnode.props[key]);
      }
    }
    insert(el, container);
  }
  function patchElement(oldVNode, newVNode) {

  }
  function patch(oldVNode, newVNode, container){

    // case1: 新旧 vnode 不是同一种类型
    if(oldVNode && oldVNode.type !== newVNode.type) {
      unmount(oldVNode);
      oldVNode = null;
    }

    // 代码运行到这里：表示 oldVNode newVNode 描述内容相同。
    const { type } = newVNode;
    if (typeof type === 'string') {
      if(!oldVNode) {
        mountElement(newVNode, container);
      } else { // 打补丁
        patchElement(oldVNode, newVNode)
      }
    } else if (typeof type === 'object') {
      // 对象 -> 描述组件
    } else if (type === 'xxx') {
      // 处理其它类型 vnode
    }
  };
  function unmount(vnode) {
    const el = vnode.el;
    const parent = el.parentNode;
    if (parent) parent.removeChildren(el);
  }
  function render(vnode, container) {
    if(vnode) {
      patch(container._vnode, vnode, container);
    } else {
      if (container._vnode) {
        unmount(container._vnode)
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
function shouldSetDOMAttributes(el, key, value) {
  // 特殊处理
  if (key === 'form' && el.tagName === 'input') return false;
  // 兜底
  return key in el;
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
  },
  // 移除子元素
  removeChildren() {

  },
  // 属性相关操作
  patchProps(el, key, prevValue, nextValue) {
    // 匹配以 on 开头的属性
    if (/^on/.test(key)) {
      let invokers = el._vei || (el._vei = {}); // 获取该元素伪造的事件处理函数
      let invoker = invokers[key]; // 根据事件名获取 invoker
      const name = key.slice(2).toLowerCase();
      if (nextValue) {
        if (!invoker) {
          // 伪造 invoker
          invoker = el._vei[key] = (e) => {
            if (Array.isArray(invoker.value)) {
              invoker.value.forEach(fn => fn(e));
            } else {
              invoker.value(e);
            }
          }
          invoker.value = nextValue;
          el.addEventListener(name, invoker); // 绑定
        } else {
          // invoker 存在，意味着只需要更新
          invoker.value = nextValue;
        }
      } else if (invoker) {
        el.removeEventListener(name, invoker);
      }
    } else if (key === 'class') {
      el.className = nextValue || '';
    } else if (shouldSetDOMAttributes(el, key, nextValue)) {
      const type = typeof el[key]; // 获取 DOM properties 类型
      if (type === 'boolean' && nextValue === '') { // disabled
        el[key] = true;
      } else {
        el[key] = nextValue;
      }
    } else {
      el.setAttribute(key, nextValue);
    }
  }
}
const renderer = createRenderer(operationObj);

const vnode = {
  type: 'div',
  props: {
    id: 'foo',
    onClick: [
      () => {
        alert('clicked1')
      },
      () => {
        alert('clicked2')
      },
    ],
    // onMouseEnter: () => {
    //   alert('onMouseEnter')
    // }
  },
  children: [
    {
      type: 'p',
      children: 'hello',
    },
  ]
}
renderer.render(vnode, document.getElementById('app'));

