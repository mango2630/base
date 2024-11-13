const effectBucket = new WeakMap(); // 存储副作用函数的依赖关系
let activeEffect; 
const effectStack = [];

function effect(fn) { // 注册副作用函数
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    // effectStack.push(effectFn);
    fn(); // 调用时会触发 track
    // effectStack.pop();
    // activeEffect = effectStack[effectStack.length - 1];
  }

  effectFn.deps = [];  // 存储所有与该辅佐函数相关联的依赖集合
  effectFn();          // 执行副作用函数
}
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i ++) {
    const dep1 = effectFn.deps[i];
    dep1.delete(effectFn);
  }
  effectFn.deps.length = 0;
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
  const deps = depsMap.get(key);
  const depsTo = new Set(deps);
  depsTo && depsTo.forEach(fn => fn());
}

const data = {
  text: 'hell world',
  age: '222'
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
  effect(function fn2() {
    console.log('effect2-fn2', obj.age);
  })
  console.log('effect1-fn1', obj.text);
})

/**
 * 先注册 fn1 副作用函数，再注册 fn2 副作用函数
 * 最终 activeEffect 被 effectFn[fn2] 覆盖
 */

setTimeout(() => {
  obj.text = '12'
}, 1000)