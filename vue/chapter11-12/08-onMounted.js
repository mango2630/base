const { effect, ref, reactive, shallowReactive, shallowReadonly } = VueReactivity;

const Text = Symbol('text');
const Fragment = Symbol('fragment');

let currentInstance = null;
function setCurrentInstance(instance) {
  currentInstance = instance;
}

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
  function patchKeyedChildren(oldVNode, newVNode, container) {
    // 取新旧节点的子元素
    const newChildren = newVNode.children;
    const oldChildren = oldVNode.children;

    // 处理相同的前置节点
    let j = 0;
    let newChildrenVNode = newChildren[j];
    let oldChildrenVNode = oldChildren[j];
    while(newChildrenVNode.key === oldChildrenVNode.key) {
      // 更新操作
      patch(oldChildrenVNode, newChildrenVNode, container);
      j ++;
      newChildrenVNode = newChildren[j];
      oldChildrenVNode = oldChildren[j];
    }

    // 处理相同的后置节点
    let newEnd = newChildren.length - 1;
    let oldEnd = oldChildren.length - 1;
    newChildrenVNode = newChildren[newEnd];
    oldChildrenVNode = oldChildren[oldEnd];
    // while 从后向前遍历，直到遇到拥有不同的 key 值的节点
    while(newChildrenVNode.key === oldChildrenVNode.key) {
      patch(oldChildrenVNode, newChildrenVNode, container);
      // oldEnd --;
      // newEnd --;
      newChildrenVNode = newChildren[-- newEnd];
      oldChildrenVNode = oldChildren[-- oldEnd];
    }

    // 挂载新增元素
    if (j > oldEnd && j <= newEnd) {
      // 锚点元素 [对 dom 的操作还是不太理解]
      const anchor = newChildren[newEnd + 1] ? newChildren[newEnd + 1].el : null;
      while(j <= newEnd) {
        patch(null, newChildren[j], container, anchor);
        j ++;
      }
    } else if (j > newEnd && j <= oldEnd) {
      while (j <= oldEnd) {
        unmount(oldChildren[j ++]);
      }
    } else {

      // source 数组将用来存储新的一组子节点中的节点在旧的一组子节点中的位置索引，
      // 后面将会使用它计算出一个最长递增子序列，并用于辅助完成 DOM 移动的操作。
      const sourceLen = newEnd - j + 1;
      const sourceArr = new Array(sourceLen);
      sourceArr.fill(-1); // 为什么用 -1 填充

      // source 数组的索引值代表新的一组子节点中对应的节点在旧的一组子节点中的位置索引
      let oldStart = j, newStart = j;

      // 构建索引表
      const keyIndex = {};
      for (let i = newStart; i <= newEnd; i ++) {
        keyIndex[newChildren[i].key] = i;
      }

      // pos 代表遍历旧的一组子节点的过程中遇到的最大索引值 k.
      let moved = false, pos = 0;
      let patched = 0; // 记录已经处理的节点数量

      for (let i = oldStart; i <= oldEnd; i ++) {
        const k = keyIndex[oldChildren[i].key];
        if (patched <= sourceLen) {
          if (k !== undefined) {
            patch(oldChildren[i], newChildren[k], container);
            sourceArr[k - newStart] = i;
            patched ++;

            // 如果在遍历过程中遇到的索引值呈现递增趋势，则说明不需要移动节点，反之则需要。
            // 所以在第二个 for 循环内，我们通过比较变量 k 与变量 pos 的值来判断是否需要移动节点。
            if (k < pos) {
              moved = true;
            } else {
              pos = k;
            }

          } else {
            unmount(oldChildren[i]);
          }
        } else {
          unmount(oldChildren[i]);
        }
      }

      if (moved) {
        const seq = lis(sourceArr); // 最长递增子序列

        let s = seq.length - 1;
        let i = sourceArr.length - 1;

        for (i; i >= 0; i --) {
          if (sourceArr[i] === -1) { // 新增元素
            // 说明索引为 i 的节点为新增节点
            const pos = i + newStart;
            const anchor = newChildren[pos + 1] ? newChildren[pos + 1].el : null;
            patch(null, newChildren[pos], container, anchor);
          } else if (i !== seq[s]) { // 移动元素
            const pos = i + newStart; // 该节点在新的一组子节点中的真实位置索引
            const anchor = newChildren[pos + 1] ? newChildren[pos + 1].el : null;
            // 移动 【为什么不 patch, 而是 insert]
            insert(newChildren[pos].el, container, anchor);
          } else {
            s --;
          }
        }
      }

      // 两层循环
      // for (let i = oldStart; i <= oldEnd; i ++) {
      //   for (let k = newStart; k <= newEnd; k ++) {
      //     if (oldChildren[i].key === newChildren[k].key) {
      //       patch(oldChildren[i], newChildren[k], container);
      //       sourceArr[k - newStart] = i;
      //       // break;
      //     }
      //   }
      // }

    }
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
      // ===========【双端 diff 算法】===============
      patchKeyedChildren(newVNode, oldVNode, container);

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
  const queue = new Set(); // 任务缓存队列
  let isFlushing = false;  // 代表是否正在刷新任务队列
  const p = Promise.resolve();
  function queueJob(job) {
    queue.add(job);
    if (!isFlushing) { // 还没有开始刷新队列，则开始刷新
      isFlushing = true;
      p.then(() => {
        try {
          queue.forEach(job => job())
        } finally {
          // 充值状态
          isFlushing = false;
          // 这样的操作对吗？？
          queue.clear = 0; // 会导致在 刷新阶段插入的任务被清除？
        }
      })
    }
  }
  function resolveProps(options, propsData) {
    const props = {};
    const attrs = {};

    for (const key in propsData) {
      // 如果为组件传递的 props 数据在组件自身的 props 选项中有定义，视为合法 Props
      if (key in options || key.startsWith('on')) {
        props[key] = propsData[key];
      } else {
        attrs[key] = propsData[key];
      }
    }
    return [props, attrs];
  }
  function onMounted(fn) {
    if (currentInstance) {
      currentInstance.mounted.push(fn);
    } else {
      console.error('onMounted 函数只能在 setup 调用');
    }
  }
  function mountComponent(vnode, container, anchor = null) {
    const componentOptions = vnode.type;
    const { render, data, props: propsOption, setup, beforeCreated, created, beforeMount, mounted, beforeUpdated, updated } = componentOptions;
    
    beforeCreated && beforeCreated();

    // 将 data 函数得到的原始数据包装为响应式数据
    const state = reactive(data);
    // 调用 resolveProps 函数解析出最终的 props 数据、 attrs 数据
    const [props, attrs] = resolveProps(propsOption, vnode.props);
    // 组件实例，包含与组件有关的状态信息
    const slots = vnode.children || {};
    const instance = {
      state, // 组件自身状态数据
      props: shallowReactive(props), // 为什么是 shallow
      isMounted: false, // 表示否是已经被挂载
      subTree: null, // 组件所渲染的内容
      slots, // 将插槽添加到组件实例上
      mounted: [],
    }
    function emit(event, ...payload) {
      const eventName = `on${event[0].toUpperCase() + event.slice(1)}`; // change -->onChange
      const handler = props[eventName];
      if (handler) {
        handler(...payload);
      } else {
        console.error('事件不存在');
      }
    }
    const setupContext = { attrs, emit, slots };
    const setupState = null; // 存储由 setup 返回的数据
    setCurrentInstance(instance)
    const setupResult = setup(shallowReadonly(instance.props), setupContext);
    setCurrentInstance(null);
    // 如果 setup 函数返回值是函数，则将其作为渲染函数
    if (typeof setupResult === 'function') {
      if (render) {
        console.error('setup 返回渲染函数，render 将被忽略');
      }
      render = setupResult;
    } else {
      setupState = setupResult;
    }

    vnode.component = instance; // 组件实例设置到 vnode 上

    const renderContext = new Proxy(instance, {
      get(t, k, r) {
        const {state, props, slots} = t;
        if (key === '$slots') return slots;
        if (state && k in state) {
          return state[k];
        } else if (k in props) {
          return props[k];
        } else if (setupState && k in setupState) {
          return setupState[k]; // 但是 setup 没有在 instance 示例上呀？？
        } else {
          console.error('不存在');
        }
      },
      set(t, k, v, r) { // 不需要使用 reflect 吗
        const { state, props } = t;
        if (state && k in state) {
          state[k] = v;
        } else if (k in props) {
          console.warn('props are only readonly');
        } else if (setupState && k in setupState) {
          setupState[k] = v;
        } else {
          console.error('不存在');
        }
      }
    })

    created && created.call(renderContext);

    effect(() => {
      // 调用 render 时，将其 this 设置为 state
      const subTree = render.call(state, state); // 获得组件虚拟 DOM 树
      if (!instance.isMounted) {
        beforeMount && beforeCreated.call(state);
        // 初次挂载
        patch(null, subTree, container, anchor);
        instance.isMounted = true;
        mounted && mounted();

        instance.mounted && instance.mounted.forEach(hook => hook.call(renderContext) )

      } else {
        beforeUpdated && beforeUpdated.call(state)
        patch(instance.subTree, subTree, container, anchor);
        updated && updated.call(state)
      }
      instance.subTree = subTree; // 更新组件实例的子树
    }, {
      // 指定该副作用函数的调度器为 queueJob
      scheduler: queueJob
    })
  }
  function hasPropsChanged(preProps, nextProps) {
    const nextKeys = Object.keys(nextProps);
    const preKeys = Object.keys(preProps);
    if (nextKeys.length !== preKeys.length) return true;

    for (const key in nextProps) {
      if (nextProps[key] !== preProps[key]) return true;
    }
    return false;
  }
  // 完成子组件的更新
  function patchComponent(oldVNode, newVNode, anchor) {
    const instance = (newVNode.component = oldVNode.component);
    const { props } = instance;
    if (hasPropsChanged(oldVNode.props, newVNode.props)) {
      const [nextProps] = resolveProps(newVNode.props, newVNode.type.props);
      // 更新 props
      for (const key in nextProps) {
        props[key] = nextProps[key];
      }
      // 删除不存在的 props
      for (const key in props) {
       if (!(key in nextProps)) {
        delete props[key];
       }
      }
    }
  }
  function patch(oldVNode, newVNode, container, anchor = null){
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
    } else if (typeof type === 'object') {
      // 对象 -> 描述组件
      if (!oldVNode) { // 挂载组件
        mountComponent(newVNode, container, anchor);
      } else { //更新组件
        patchComponent(oldVNode, newVNode, anchor);
      }
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
      if (container._vnode) { // 卸载
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

// <template>
// <MyComponent title="A big title" @change="handler" ></MyComponent>
// </template>

const MyComponent = {
  name: 'MyComponent',
  data() {
    return {
      foo: 1,
    }
  },
  props: {
    // 虚拟 DOM 层面，组件的 props 与 HTML 标签的属性差别不大
    title: "A big title",
    other: this.val,
  },
  render() {
    return {
      type: 'div',
      children: `我是组件的内容: ${this.count}`,
    }
  },
  setup(props, { attrs, emit }) {
    const count = ref(0);
    emit('change', 1, 2, 3);
    return {count}
  }
}

const vnode = {
  type: MyComponent,
  props: {
    onChange: handler
  }
}

renderer.render(vnode, document.querySelector('#app'));