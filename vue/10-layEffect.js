const effectBucket = new WeakMap(); // 存储副作用函数的依赖关系
let activeEffect; 
const effectStack = [];

function effect(fn, options = {}) { // 注册副作用函数
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
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

const effectFn = effect(function fn1() {
  document.body.innerText = obj.age;
  console.log(obj.age);
}, {
  scheduler: (fn) => {
    fn();
  },
  lazy: true,
});
const fnRes = effectFn()

obj.age ++;
obj.age ++;

console.log('结束了');
