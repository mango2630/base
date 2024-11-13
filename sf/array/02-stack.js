class Stack {
  constructor() {
    this.items = []; // 存储栈的元素
  }
  push(element) {
    this.items.push(element);
  }
  pop() {
    // 返回被弹出的栈顶元素
    return this.items.pop();
  }
  peek() {
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    return this.items.length === 0;
  }
  clear() {
    this.items = [];
  }
  size() {
    return this.items.length;
  }
}

const stack = new Stack();
console.log(stack.isEmpty());