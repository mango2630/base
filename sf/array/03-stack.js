const _items = Symbol('stackItems');
class Stack {
  constructor() {
    this.items   = {};
    this.count = 0;
  }
  push(element) {
    this.items[this.count ++] = element;
  }
  size() {
    return this.count;
  }
  isEmpty() {
    return this.count === 0;
  }
  pop() {
    if(this.isEmpty()) {
      return undefined;
    }
    this.count --;
    const res = this.items[this.count];
    delete this.items[this.count]; // 手动删除
    return res;
  }
  peek() {
    if (this.isEmpty()) return undefined;
    return this.items[this.count - 1];
  }
  clear() {
    this.items = {};
    this.count = 0;

    // while(this.isEmpty()) {
    //   this.pop()
    // }
  }
}

const stack = new Stack();
const res = Object.getOwnPropertySymbols(stack); // [ 'items', 'count' ]
console.log(res);
