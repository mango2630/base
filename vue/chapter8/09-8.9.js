function createRenderer(options) {
  const {
    createElement,
    insert,
    setElementText,
    patchProps,
  } = options;

  function mountElement(vnode, container) {
    // 创建 DOM 元素
    const el = vnode.el = createElement(vnode.type); // 这里为什么要存储这个 dom 元素 （vnode.el)
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
  function patchChildren(oldVNode, newVNode, container) {
    if (typeof newVNode.children === 'string') { // 判断新的子节点类型是否为文本节点
      // 旧子节点的类型有三种可能：没有子节点、文本节点、一组子节点
      // 只有当旧子节点为一组时，需要逐个卸载
      if (Array.isArray(oldVNode.children)) {
        oldVNode.children.forEach(node => unmount(node));
      }
      setElementText(container, newVNode.children);
    } else if (Array.isArray(newVNode.children)) { // 新节点为一组节点

      // 判断旧子节点是否也是一组
      if (Array.isArray(oldVNode.children)) {
        // diff 算法

        // 简单：卸载旧的、挂载新的
        // console.log('patchchildren');
        oldVNode.children.forEach(vnode => unmount(vnode));
        newVNode.children.forEach(vnode => patch(null, vnode, container))

      } else { // 旧子节点为 文本/不存在
        // 清空容器
        setElementText(container, '');
        // 挂载新的
        newVNode.children.forEach(vnode => patch(null, vnode, container));
        // 问题：没有理解这里为什么时调用 patch
      }
    } else { // 新节点不存在
      // 旧节点为一组节点，逐个卸载
      if (Array.isArray(oldVNode.children)) {
        oldVNode.children.forEach(vnode => unmount(vnode));
      } else if(typeof oldVNode.children === 'string') {
        // 清空容器
        setElementText(container, '');
      }
    }
  }
  function patchElement(oldVNode, newVNode) { // 更新操作
    console.log('patchElement');
    // 走到 patchElement 这里，说明 vnode 节点 type 相同
    const el = newVNode.el = oldVNode.el;
    const oldProps = oldVNode.props;
    const newProps = newVNode.props;

    // 第一步： 更新 props
    for (const key in newProps) {
     if (newProps[key] !== oldProps[key]) {
      patchProps(el, key, oldProps[key], newProps[key]);
     }
    }
    for (const key in oldProps) {
      if (!(key in newProps)) {
        patchProps(el, key, oldProps[key], null);
      }
    }

    // 第二步：更新 children
    patchChildren(oldVNode, newVNode, el);
  }
  function patch(oldVNode, newVNode, container){
    console.log('patch', oldVNode);
    // case1: 新旧 vnode 不是同一种类型
    if(oldVNode && oldVNode.type !== newVNode.type) {
      unmount(oldVNode);
      oldVNode = null;
    }
    console.log('patch-1');
    // 代码运行到这里：表示 oldVNode newVNode 描述内容相同。
    const { type } = newVNode;
    if (typeof type === 'string') { // 标签
      if(!oldVNode) {
        console.log('patch-2');
        mountElement(newVNode, container);
      } else { // 打补丁
        console.log('patch-3');
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
      // 新 vnode 存在，将其与旧 vnode 一起传递给 patch
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
  createText(text){
    return document.createTextNode(text);
  },
  setText(el, text) {
    el.nodeValue = text;
  },
  createComment(comment) {
    return document.createComment(comment);
  },
  // 属性相关操作
  patchProps(el, key, prevValue, nextValue) {
    // 匹配以 on 开头的属性
    if (/^on/.test(key)) {
      let invokers = el._vei || (el._vei = {}); // 获取该元素伪造的事件处理函数
      let invoker = invokers[key]; // 根据事件名获取 invoker
      const name = key.slice(2).toLowerCase(); // 事件名
      // console.log('patchProps-event', el, key, nextValue);
      if (nextValue) {
        if (!invoker) {
          // e.timeStamp 事件发生时间 （事件触发时间）
          // invoker.attached 事件绑定时间)
          invoker = el._vei[key] = (e) => {
            console.log(e); // event 中有 timeStamp 这个属性
            if (e.tempStamp < invoker.attached) return;
            if (Array.isArray(invoker.value)) {
              invoker.value.forEach(fn => fn(e));
            } else {
              invoker.value(e);
            }
          }
          invoker.value = nextValue;
          invoker.attached = performance.now(); // 存储时间处理函数被绑定的时间
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

const { effect, ref } = VueReactivity;

const bol = ref(false);
const vnode = {
  type: 'div',
  props: bol.value ? {
    onClick: () => {
      alert('parent');
    }
  } : {},
  children: [
    {
      type: 'p',
      props: {
        onClick: () => {
          bol.value = true;
        }
      },
      children: 'text'
    }
  ]
}

effect(() => {
  renderer.render(vnode, document.getElementById('app'));
})
