// const Compare = {
//   LESS_THAN
// }

class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.compareFn = (val1, val2) => {
      if (val1 > val2) return 1;
      else if (val1 === val2) return 0;
      else return -1;
    }; //比较节点的值
    this.root = null; // 存放树的根节点。
  }

  insert(key) { // 向树中插入一个新建
    if (!this.root) {
      this.root = new Node(key);
    } else {
      this.insertNode(this.root, key)
    }
  }
  insertNode(node, key) {
    if (this.compareFn(node.key, key) === 1) {
      if (!node.left) {
        node.left = new Node(key);
      } else {
        this.insertNode(node.left, key);
      }
    } else {
      if (!node.right) {
        node.right = new Node(key);
      } else {
        this.insertNode(node.right, key);
      }
    }
  }

  // 中序遍历
  inOrderTraverse(callback) {
    this.inOrderTraverseNode(this.root, callback);
  }
  inOrderTraverseNode(node, callback) {
    if (node === null) return;
    this.inOrderTraverseNode(node.left, callback)
    callback(node);
    this.inOrderTraverseNode(node.right, callback);
  }

  // 先序遍历
  preOrderTraverse(callback) {
    this.preOrderTraverseNode(this.root, callback);
  }
  preOrderTraverseNode(node, callback) {
    if (node === null) return;
    callback(node);
    this.preOrderTraverseNode(node.left, callback)
    this.preOrderTraverseNode(node.right, callback);
  }

  // 后序遍历
  postOrderTraverse(callback) {
    this.postOrderTraverseNode(callback)
  }
  postOrderTraverseNode(node, callback) {
    if (node === null) return;
    this.postOrderTraverseNode(node.left, callback);
    this.postOrderTraverseNode(node.right, callback)
    callback(node)
  }

  // 最小值
  min() {
    return this.minNode(this.root);
  }
  minNode(node) {
    let current = node;
    while(current !== null && current.left !== null) {
      current = current.left;
    }
    return current;
  }

  // 特定值
  search(key) {
    return this.searchNode(this.root, key);
  }
  searchNode(node, key) {
    if (node === null) return false;
    if (this.compareFn(node.key, key) === 1) { // node.key > key
      this.searchNode(node.left, key);
    } else if (this.compareFn(node.key, key) === -1) { // node.key < key
      this.searchNode(node.right, key);
    } else { // node.key === key
      return true;
    }
  }

  // 移除值
  remove(key) {
    this.root = this.removeNode(this.root, key);
    return this.root;
  }
  removeNode(node, key) {
    if (node === null) return node;
    else if (this.compareFn(node.key, key) === 1) { // node.key > key
      node.left = this.removeNode(node.left, key);
      return node;
    } else if (this.compareFn(node.key, key) === -1) {  // node.key < key
      node.right = this.removeNode(node.right, key);
      return node;
    } else {
      // way1: left right 为 null
      if (node.left === null && node.right === null) {
        node = null;
        return node;
      }

      // way2: left / right 为 null
      if (node.left === null) {
        node = node.right;
        return node;
      } else if(node.right === null) {
        node = node.left;
        return node;
      }

      // way3: left right 都不为 null
      const temp = this.minNode(node.right);
      node.key = temp.key;
      this.removeNode(node.right, temp.key);
      return node;
    }
  }
}

const bst = new BinarySearchTree();
bst.insert(1);
bst.insert(2);
bst.insert(3);
bst.insert(-3);
// bst.inOrderTraverse((node) => console.log(node.key));

// console.log(bst.min());
// console.log(bst.search(-1));
// console.log(bst.root);

console.log(bst.remove(2));