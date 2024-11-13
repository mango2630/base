const effectBucket = new WeakMap(); // 存储副作用函数的依赖关系
let activeEffect; 
const effectStack = [];

const TriggerType = {
  SET: "SET",
  ADD: "ADD",
  DELETE: 'DELETE'
}

function effect(fn, options = {}) { // 注册副作用函数
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    // console.error('effect', fn);
    const res = fn(); // 调用时会触发 track
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    return res;
  }
  effectFn.options = options
  effectFn.deps = [];  // 存储所有与该辅佐函数相关联的依赖集合
  if (!options.lazy) {
    effectFn();          // 执行副作用函数
  }
  return effectFn
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
  deps.add(activeEffect);
  activeEffect.deps.push(deps);
}
function trigger(target, key, type) {
  let depsMap = effectBucket.get(target);
  if (!depsMap) return;
  const iterateEffects = depsMap.get('ITERATE_KEY');
  const deps = depsMap.get(key);
  const depsTo = new Set();
  if (type === TriggerType.ADD || type === TriggerType.DELETE) {
    iterateEffects && iterateEffects.forEach(fn => {
      if (fn !== activeEffect) {
        depsTo.add(fn)
      }
    })
  }
  deps && deps.forEach(fn => {
    if (fn !== activeEffect) {
      depsTo.add(fn);
    }
  })
  depsTo && depsTo.forEach(fn => {
    if (fn.options.scheduler) {
      fn.options.scheduler(fn);
    } else {
      fn();
    }
  });
}

const obj = {
  age: 12,
}
  
const p = new Proxy(obj, {
  get(target, key, receiver) {
    track(target, key);
    return Reflect.get(target, key, receiver)
  },
  has(target, key) {
    track(target, key);
    return Reflect.has(target, key);
  },
  ownKeys(target) {
    track(target, 'ITERATE_KEY');
    return Reflect.ownKeys(target)
  },
  set(target, key, newVal, receiver) {
    const oldValue = target[key];
    const type = Object.prototype.hasOwnProperty.call(target, key) ? TriggerType.SET : TriggerType.ADD;
    const res = Reflect.set(target, key, newVal, receiver);
    if (oldValue !== newVal && (oldValue === oldValue || newVal === newVal)) { // 新值与旧值相同时，不触发响应
      trigger(target, key, type);
    }
    // 全等比较的缺陷
    // NaN !== NaN // true
    // NaN === NaN // false
    return res;
  },
  deleteProperty(target, key) {
    const hasKey = Object.prototype.hasOwnProperty.call(target, get);
    const res = Reflect.defineProperty(target, key);
    if (res && hasKey) {
      trigger(target, key, TriggerType.DELETE);
    }
  }
})

effect(() => {
  for (const key in p) {
    console.log(key);
  }
})

p.name = 'denny';


