const effectBucket = new WeakMap(); // 存储副作用函数的依赖关系

let activeEffect;     // 全局变量 存储被注册的副作用函数 [给当前对象添加任何属性，都会注册该 effect / 新对应的 effect]
function effect(fn) { // 注册副作用函数
  
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn; // 每次 trigger 执行副作用函数时，都会做一次赋值；感觉怪怪的
    fn();
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
  show: true
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

effect(function fn() {
  document.body.innerText = obj.text;
})

setTimeout(() => {
  obj.text = '12'
}, 1000)