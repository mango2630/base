const effectBucket = new WeakMap(); // 存储副作用函数的依赖关系
let activeEffect; 
const effectStack = [];

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
  deps.add(activeEffect); // deps 表示与副作用函数存在联系的依赖集合
  activeEffect.deps.push(deps);
}
function trigger(target, key) {
  let depsMap = effectBucket.get(target);
  if (!depsMap) return;
  const deps = depsMap.get(key); // oo,这个 key 对应的 set 可能会不存在；因为只有这个 obj 被 track 过，key 并未 track
  const depsTo = new Set();
  deps && deps.forEach(fn => {  // 为什么需要判断 deps 是否存在
    if (fn !== activeEffect) {  // 避免无限递归
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

const jobQueue = new Set();
let isFlushing = false;
const p = Promise.resolve()
function flushJob() {
  if (isFlushing) return;
  isFlushing = true;
  p.then(() => {
    jobQueue.forEach(job => job());
  }).finally(() => {
    isFlushing = false;
  })
}

const data = {
  age: 12,
  gender: 'girl',
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

// 在 watch 内部的 effect 中调用 traverse 函数进行递归的读取操作，代替硬编码的方式，这样就能读取一个对象上的任意属性，从而当任意属性发生变化时都能够触发回调函数执行。
// 没理解这里在干什么
function traverse(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return;
  seen.add(value);
  // 假设 value 是一个对象
  for (const key in value) {
    if (Object.hasOwnProperty.call(value, key)) {
      traverse(value[key], seen);
    }
  }
  return value;
}

function watch(source, callback) {
  let getter;
  if (typeof source === 'function') {
    getter = source;
  } else {
    getter = () => traverse(source);
    // console.log('traverse(source)', traverse(source), source);
  }
  let oldValue, newValue;

  const effectFn = effect(
    // () => source.age, // v1【硬编码】为什么是 source.age，用户传入的 source 如果是一个 obj 呢？
    // () => traverse(source), // v2 封装一个通用的读取操作，traverse 递归地读取
    () => getter(),
    {
      lazy: true,
      scheduler: (fn) => {
        newValue = effectFn();
        console.log('watch--scheduler', newValue,oldValue);
        callback(newValue, oldValue);  // 执行 callback, callback 中会重新读取
        oldValue = newValue;
      }
    }
  )
  console.log('watch--');
  oldValue = effectFn(); // ?? 手动调用辅佐函数，拿到的就是旧值；即第一次执行得到的值
}

// watch 观测响应式数据【这里有问题：oldvalue 不是旧值】
watch(obj, (newValue, oldValue) => {
  console.log('data change-obj', newValue, oldValue);
})
// watch 观测 getter 函数
// 在 getter 函数内部，用户可以指定该 watch 依赖哪些响应式数据，只有当这些数据变化时，才会触发回调函数执行
watch(
  () => obj.age, 
  (newValue, oldValue) => {
    console.log('data change-obj.age', newValue, oldValue);
  }
);
obj.age ++;
obj.age ++;