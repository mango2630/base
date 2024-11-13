function createRenderer() {
  function patch(oldVNode, newVNode, container){};

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

const renderer = createRenderer();
renderer.render(vnode, document.getElementById('app'));