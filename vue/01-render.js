const obj = {
  tag: 'div',
  children: [
    { tag: 'span', children: 'hello world' }
  ]
}

function foo(obj) {
  obj && obj.foo
}
foo()