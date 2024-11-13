const map = new Map();
const weakMap = new WeakMap();

(function() {
  const foo = {a: 1};
  const bar = {b: 1};

  map.set(foo, 1);
  weakMap.set(bar, 1);
})()

console.log(map, weakMap); // Map(1) { { a: 1 } => 1 } WeakMap { <items unknown> }