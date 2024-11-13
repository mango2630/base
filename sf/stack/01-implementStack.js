class Stack {
  array = [];
  constructor(array){
    this.array = array || [];
  }

  push(ele) {
    this.array.push(ele);
  }
  pop() {
    return this.array.pop();
  }
  peek() {
    return this.array[this.array.length - 1];
  }
  size() {
    return this.array.length;
  }
}

const s = new Stack();
s.push(1);
s.push(1);

console.log(s.peek(), s);

