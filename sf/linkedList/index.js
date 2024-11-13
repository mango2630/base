class Node {
  constructor(element) {
    this.val = element;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.count = 0;        // 链表中元素数量
    this.head = null;      // 第一个元素的引用
    this.equalsFn = (a, b) => a === b;
  }
  // 链表尾部插入元素
  push(element) {
    const node = new Node(element);
    if (this.head === null)  {
      this.head = node;
    } else {
      let prevNode = this.head;
      while(prevNode.next !== null) {
        prevNode = prevNode.next;
      }
      prevNode.next = node;
    }
    this.count ++;
  }
  // 移除指定位置的元素：返回移除元素的值
  removeAt(index) {
    // way1:
    // if (index > this.count || index <= 0) return undefined;
    // let prev = null;
    // let cur = this.head;
    // if (index === 1) this.head = cur.next;
    // else {
    //   while(-- index) {
    //     prev = cur;
    //     cur = cur.next;
    //   }
    //   prev.next = cur.next;
    // }
    
    // way2:
    let cur = new Node();
    if (index === 1) this.head = this.head.next;
    else {
      const prev = this.getNodeAt(index - 1);
      cur = prev.next;
      prev.next = cur.next;
    }
    this.count --;
    return cur.val;
  }
  // 在链表的任意位置插入元素
  insert(element, index) {
    if (index === 1) {
      element.next = this.head.next;
      this.head = element;
      this.count ++;
      return true;
    }
    
    let prev = this.getNodeAt(index - 1); // 严格来说，需要判断这个 getNodeAt 获取到的值是否为 node 类型；不是也要返回 false
    if (prev === undefined) return false;
    element.next = prev.next;
    prev.next = element.next;
    this.head ++;
    return true;
  }
  // 返回元素的位置
  indexOf(element) {
    let cur = this.head;
    for (let i = 1; i <= this.count; i ++){
      if (this.equalsFn(cur.val, element)) {
        return i;
      }
      cur = cur.next;
    }
    return -1;
  }
  // 从链表中移除指定元素
  remove(element) {
    const index = this.indexOf(element);
    return this.removeAt(index);
  }

  // 复制链表中的某一段 [left, right] 1 <= len <= n
  copyLinkedList(left, right) {
    let cur = this.head;
    let cha = right - left;
    
    while(-- left) { //  找到 left 节点
      cur = cur.next;
    }
    console.log('cur', cur);

    // 复制链表中的指定范围
    let newHead = new Node(cur.val);
    let newNext = newHead;
    while(cha --) {
      cur = cur.next;
      if (cur) {
        newNext.next = new Node(cur.val);
        newNext = newNext.next;
      }
    }
    return newHead;
  }

  // 工具函数：循环链表到目标索引位置，并返回对应位置的节点
  getNodeAt(index) {
    if (index < 0 || index > this.count) return undefined;
    if (index === 0) return this.head;
    let cur = this.head;
    while(-- index) {
      cur = cur.next;
    }
    return cur;
  }
}

const list = new LinkedList();
list.push(1);
list.push(2);
list.push(3);
list.push(4);
list.push(5);
list.push(6);
// list.removeAt(5)
// console.log(JSON.stringify(list));
console.log(JSON.stringify(list.copyLinkedList(2, 4)));