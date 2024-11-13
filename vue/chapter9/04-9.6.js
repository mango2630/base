const Text = Symbol('text');
const Fragment = Symbol('fragment');

function createRenderer(options) {
  const {
    createElement,
    insert,
    setElementText,
    patchProps,
    createText,
    setText,
    createComment,
  } = options;

  function mountElement(vnode, container, anchor = null) {
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
    insert(el, container, anchor);
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
        const oldChildren = oldVNode.children;
        const newChildren = newVNode.children;
        let lastIndex = 0; // 存储寻找过程中遇到的最小索引值

        // 更新操作
        for(let i = 0; i < newChildren.length; i ++) {
          let find = false; // 代表是否在旧的一组子节点中找到可复用的节点
          for(let j = 0; j < oldChildren.length; j ++) {
            if (newChildren[i].key === oldChildren[j].key) { // 移动元素
              patch(oldChildren[j], newChildren[i], container);
              if (j < lastIndex) {
                const prevNode = newChildren[i - 1];
                if (prevNode) {
                  // https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nextSibling
                  const anchor = prevNode.el.nextSibling;
                  insert(newChildren[i].el, container, anchor);
                }
              } else {
                lastIndex = j;
              }
              break;
            }
          }
          if (!find) { // 在旧的 vnode 未找到 newChildren[i],新增节点
            const prevNode = newChildren[i - 1];
            let anchor = null;
            if (prevNode) {
              // 如果有前一个 vnode 节点，则使用他的下一个兄弟节点作为锚点元素 ??
              anchor = prevNode.el.nextSibling;
            } else {
              // 没有前一个 vnode, 即将挂载的新节点是第一个子节点
              // 使用容器元素的 firstChild 作为锚点
              anchor = container.firstChild;
            }
            patch(null, newChildren[i], container, anchor);
          }
        }

        // 遍历旧的一组子节点，移除新 vnode 不存在的元素
        for(let i = 0; i < oldChildren.length; i ++) {
          const has = newChildren.find(newNode => newNode.key === oldChildren[i].key);
          if (!has) {
            // 没有找到，则需要卸载
            unmount(oldChildren[i]);
          }
        }

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
  function patch(oldVNode, newVNode, container, anchor = null){
    console.log('patch', oldVNode);
    // case1: 新旧 vnode 不是同一种类型
    if(oldVNode && oldVNode.type !== newVNode.type) {
      unmount(oldVNode);
      oldVNode = null;
    }
    // 代码运行到这里：表示 oldVNode newVNode 描述内容相同。
    const { type } = newVNode;
    if (typeof type === 'string') { // 标签
      if(!oldVNode) {
        mountElement(newVNode, container, anchor);
      } else { // 打补丁
        patchElement(oldVNode, newVNode)
      }
    } else if (type === Text) { // 纯文本节点
      // 如果没有旧节点，则进行挂载
      if (!oldVNode) {
        const el = newVNode.el = createText(newVNode.children);
        // 将文本插入容器
        insert(el, container, anchor);
      } else { // 如果旧的 vnode 存在，替换
        const el = newVNode.el = oldVNode.el;
        if (newVNode.children !== oldVNode.children) {
          // el.nodeValue = newVNode.children;
          setText(el.nodeValue, newVNode.children)
        }
      }
    } else if (type === Comment) {
      // createComment
    } else if (type === Fragment) {
      if (!oldVNode) {
        newVNode.children.forEach(vnode => patch(null, vnode, container));
      } else {
        // 如果 oldVNode 存在，只需要更新 fragment 中的 children
        patchChildren(oldVNode, newVNode, container)
      }
    }
    else if (typeof type === 'object') {
      // 对象 -> 描述组件
    } else if (type === 'xxx') {
      // 处理其它类型 vnode
    }
  };
  function unmount(vnode) {
    if (vnode.type === Fragment) {
      vnode.children.forEach(vnode => unmount(vnode))
    }
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

const { effect, ref, reactive } = VueReactivity;

const oldVNode = reactive(
  {
    type: 'div',
    children: [
      { type: 'p', children: '1', key: 1 },
      { type: 'p', children: '2', key: 2 },
      { type: 'p', children: 'hello', key: 3 }
    ]
  }
)

const newVNode = {
  type: 'div',
  children: [
    { type: 'p', children: 'world', key: 3 },
    { type: 'p', children: '1', key: 1 },
    { type: 'p', children: '2', key: 2 }
  ]
 }

 // 首次挂载
 renderer.render(oldVNode, document.querySelector('#app'))
 setTimeout(() => {
   // 1 秒钟后更新
   renderer.render(newVNode, document.querySelector('#app'))
 }, 1000);

// effect(() => {
//   renderer.render(vnode, document.getElementById('app'));
// })


// 统一个 dom 上挂载东西，并不会把之前的覆盖/卸载调

