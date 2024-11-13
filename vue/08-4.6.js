const effectBucket = new WeakMap(); // 存储副作用函数的依赖关系
let activeEffect; 
const effectStack = [];

function effect(fn) { // 注册副作用函数
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    fn(); // 调用时会触发 track
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
  }

  effectFn.deps = [];  // 存储所有与该辅佐函数相关联的依赖集合
  effectFn();          // 执行副作用函数
}
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i ++) {
    const dep1 = effectFn.deps[i];
    dep1.delete(effectFn);
  }
  effectFn.deps.length = 0; // 为什么需要手动重制为0
}

function track(target, key) {
  if (!activeEffect) return target[key];
  let depsMap = effectBucket.get(target);;
  if (!depsMap) {
    effectBucket.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect); // deps 表示与副作用函数存在联系的依赖集合
  activeEffect.deps.push(deps);
}

function trigger(target, key) {
  let depsMap = effectBucket.get(target);
  if (!depsMap) return;
  const deps = depsMap.get(key); // oo,这个 key 对应的 set 可能会不存在；因为只有这个 obj 被 track 过，key 并未 track
  const depsTo = new Set();
  deps && deps.forEach(fn => {   // 为什么需要判断 deps 是否存在
    if (fn !== activeEffect) {
      depsTo.add(fn);
    }
  })
  depsTo && depsTo.forEach(fn => fn());
}

const data = {
  age: 12
}

const obj = new Proxy(data, {
  get(target, key) {
    track(target, key);
    return target[key];
  },
  set(target, key, value) {
    target[key] = value;
    trigger(target, key);
    return true;
  }
})

effect(function fn1() {
  // document.body.innerText = obj.age ++
  obj.age ++
})

/**
 * 先注册 fn1 副作用函数，再注册 fn2 副作用函数
 * 最终 activeEffect 被 effectFn[fn2] 覆盖
 */

// setTimeout(() => {
//   obj.text = '12'
// }, 1000)