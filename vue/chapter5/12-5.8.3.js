const effectBucket = new WeakMap(); // 存储副作用函数的依赖关系
let activeEffect; 
const effectStack = [];

const TriggerType = {
  SET: "SET",
  ADD: "ADD",
  DELETE: 'DELETE'
}

const reactiveMap = new Map();
const arrayInstrumentations = {}

let shouldTrack = true; // 一个标记变量，代表是否进行追踪。true 允许追踪
['push', 'pop', 'shift', 'unshift', 'splice'].forEach(method => {
  const originMethod = Array.prototype[method];
  arrayInstrumentations[method] = function(...args) {
    shouldTrack = false; // 调用原始方法前，禁止追踪
    let res = originMethod.apply(this, args);
    shouldTrack = true; // 调用原始方法后，恢复原来的行为，允许追踪
    return res;
  }
});

['includes', 'indexOf', 'lastIndexOf'].forEach(method => {
  const originMethod = Array.prototype[method];
  arrayInstrumentations[method] = function(...args) {
    let res = originMethod.apply(this, args);
    if (res === false || res === -1) {
      res = originMethod.apply(this.raw, args);
    }
    return res;
  }
});

const mutableInStrumentations = {
  add(key) { // set-add
    const target = this.raw; // 获取原对象
    const hadKey = target.has(key);
    const res = target.add(key);
    if (!hadKey) {
      trigger(target, key, TriggerType.ADD); // 只有值不存在时，才需要出发响应
    }
    return res;
  },
  delete(key) { // set-delete
    const target = this.raw; // 获取原对象
    const hadKey = target.has(key);
    const res = target.delete(key);
    if (hadKey) { // 当要删除的 key 确实存在，才触发响应
      trigger(target, key, TriggerType.DELETE);
    }
    return res;
  },
  get(key) { // map-get
    const target = this.raw;
    const hadKey = target.has(key);
    track(target, key);
    if (hadKey) {
      const res = target.get(key);
      return typeof res === 'object' ? reactive(res) : res;
    }
  },
  set(key, value) {
    const target = this.raw;
    const hadKey = target[key];
    const oldValue = target.get(key);
    const rawValue = value.raw || value
    target.set(key, rawValue);

    if (!hadKey) {
      // 不存在，ADD 操作，新增，size 变换
      trigger(target, key, TriggerType.ADD);
    } else if (oldValue !== value || (oldValue === oldValue && value === value)) {
      trigger(target, key, TriggerType.SET);
    }
  }
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
  // console.log(`track ==> ${target} ++ ${key} ++`);
  if (!activeEffect || !shouldTrack) return target[key];
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
function trigger(target, key, type, newVal) {
  // console.error(`=== ${target} === ${key} === ${newVal}`);
  let depsMap = effectBucket.get(target);
  if (!depsMap) return;
  const iterateEffects = depsMap.get('ITERATE_KEY');
  const deps = depsMap.get(key);
  const effectToRun = new Set();

  // 处理元素新增时，length 属性变化的响应式
  if (type === TriggerType.ADD && Array.isArray(target)) {
    // 取出与 length 相关联的副作用函数
    const lengthEffects = depsMap.get('length');
    // 将这些副作用函数添加到 effectsToRun 中
    lengthEffects && lengthEffects.forEach(lengthEffect => {
      if (lengthEffect !== activeEffect) {
        effectToRun.add(lengthEffect);
      }
    })
  }
  // 处理当 length 被修改时，被删除元素的的响应式
  if (Array.isArray(target) && key === 'length') {
    depsMap.forEach((deps, key) => {
      if (key >= newVal) { 
        deps.forEach(effectFn => {
          if (effectFn !== activeEffect) {
            effectToRun.add(effectFn);
          }
        })
      }
    })
  }
  if (type === TriggerType.ADD || type === TriggerType.DELETE) {
    iterateEffects && iterateEffects.forEach(fn => {
      if (fn !== activeEffect) {
        effectToRun.add(fn)
      }
    })
  }
  deps && deps.forEach(fn => {
    if (fn !== activeEffect) {
      effectToRun.add(fn);
    }
  })
  effectToRun && effectToRun.forEach(fn => {
    if (fn.options.scheduler) {
      fn.options.scheduler(fn);
    } else {
      fn();
    }
  });
}

// 代理集合
function proxyObj(obj, isShallow , isReadonly) {
  const p =  new Proxy(obj, {
    get(target, key, receiver) {
      console.log(`Proxy-get ===> ${target} === ${key} === `);
      if (key === 'raw') return target;
      if (key === 'size') {
        track(target, 'ITERATE_KEY'); // 调用 track 函数建立响应联系
        return Reflect.get(target, key, target);
      }
      return mutableInStrumentations[key]; // 返回 mutableInStrumentations 中重写的方法
    },
    set(target, key, newVal, receiver) {
      console.log(`proxy-set => ${target}`);
    }
  })
  return p;
}

function createReactive(obj, isShallow = false, isReadonly = false) {
  return proxyObj(obj, isShallow, isReadonly);
}

function reactive(obj) {
  const existProxy = reactiveMap.get(obj);
  if (existProxy) return existProxy;
  const proxy = createReactive(obj);
  reactiveMap.set(obj, proxy);
  return proxy;
}
function shallowReactive(obj) {
  return createReactive(obj, true);
}
function readonly(obj) {
  return createReactive(obj, false, true);
}
function shallowReadonly(obj) {
  return createReactive(obj, true, true);
}


// const map = new Map([['key1', 1]]);
// const mapObj = reactive(map);

// effect(() => {
//   console.log(mapObj.get('key1')); // error1: mapObj.get is not a function
// })
// mapObj.set('key1', 2) // 应该触发响应
// console.log('map', map);

const m = new Map();
const p1 = reactive(m);
const p2 = reactive(new Map());
p1.set('p2', p2);
effect(() => {
  console.log(m.get('p2').size);
})
m.get('p2').set('foo', 1); // 原始数据 m 修改值，原则上不应该具有响应式能力
