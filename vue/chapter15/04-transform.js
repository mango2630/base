// 定义状态机的状态
const State = {
  initial: 1,    // 初始状态
  tagOpen: 2,    // 标签开始状态
  tagName: 3,    // 标签名称状态
  text: 4,       // 文本状态
  tagEnd: 5,     // 结束标签状态
  tagEndName: 6  // 结束标签名称状态
}
// 一个辅助函数，用于判断是否是字母
function isAlpha(char) {
  return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z'
}
function tokenize(str) {
  // 状态机的当前状态：初始状态
  let currentState = State.initial
  // 用于缓存字符
  const chars = []
  // 生成的 Token 会存储到 tokens 数组中，并作为函数的返回值返回
  const tokens = []
  // 使用 while 循环开启自动机，只要模板字符串没有被消费尽，自动机就会一直运行
  while(str) {
    // 查看第一个字符，注意，这里只是查看，没有消费该字符
    const char = str[0]
    // console.log('char', str, '--', str[0]);
    // switch 语句匹配当前状态
    switch (currentState) {
      // 状态机当前处于初始状态
      case State.initial:
        // 遇到字符 <
        if (char === '<') {
          // 1. 状态机切换到标签开始状态
          currentState = State.tagOpen
          // 2. 消费字符 <
          str = str.slice(1)
        } else if (isAlpha(char)) {
          // 1. 遇到字母，切换到文本状态
          currentState = State.text
          // 2. 将当前字母缓存到 chars 数组
          chars.push(char)
          // 3. 消费当前字符
          str = str.slice(1)
        }
        break
      // 状态机当前处于标签开始状态
      case State.tagOpen:
        if (isAlpha(char)) {
          // 1. 遇到字母，切换到标签名称状态
          currentState = State.tagName
          // 2. 将当前字符缓存到 chars 数组
          chars.push(char)
          // 3. 消费当前字符
          str = str.slice(1)
        } else if (char === '/') {
          // 1. 遇到字符 /，切换到结束标签状态
          currentState = State.tagEnd
          // 2. 消费字符 /
          str = str.slice(1)
        }
        break
      // 状态机当前处于标签名称状态
      case State.tagName:
        if (isAlpha(char)) {
          // 1. 遇到字母，由于当前处于标签名称状态，所以不需要切换状态，
          // 但需要将当前字符缓存到 chars 数组
          chars.push(char)
          // 2. 消费当前字符
          str = str.slice(1)
        } else if (char === '>') {
          // 1.遇到字符 >，切换到初始状态
          currentState = State.initial
          // 2. 同时创建一个标签 Token，并添加到 tokens 数组中
          // 注意，此时 chars 数组中缓存的字符就是标签名称
          tokens.push({
            type: 'tag',
            name: chars.join('')
          })
          // 3. chars 数组的内容已经被消费，清空它
          chars.length = 0
          // 4. 同时消费当前字符 >
          str = str.slice(1)
        }
        break
      // 状态机当前处于文本状态
      case State.text:
        if (isAlpha(char)) {
          // 1. 遇到字母，保持状态不变，但应该将当前字符缓存到 chars 数组
          chars.push(char)
          // 2. 消费当前字符
          str = str.slice(1)
        } else if (char === '<') {
          // 1. 遇到字符 <，切换到标签开始状态
          currentState = State.tagOpen
          // 2. 从 文本状态 --> 标签开始状态，此时应该创建文本 Token，并添加到 tokens 数组
          // 注意，此时 chars 数组中的字符就是文本内容
          tokens.push({
            type: 'text',
            content: chars.join('')
          })
          // 3. chars 数组的内容已经被消费，清空它
          chars.length = 0
          // 4. 消费当前字符
          str = str.slice(1)
        }
        break
      // 状态机当前处于标签结束状态
      case State.tagEnd:
        if (isAlpha(char)) {
          // 1. 遇到字母，切换到结束标签名称状态
          currentState = State.tagEndName
          // 2. 将当前字符缓存到 chars 数组
          chars.push(char)
          // 3. 消费当前字符
          str = str.slice(1)
        }
        break
      // 状态机当前处于结束标签名称状态
      case State.tagEndName:
        if (isAlpha(char)) {
          // 1. 遇到字母，不需要切换状态，但需要将当前字符缓存到 chars 数组
          chars.push(char)
          // 2. 消费当前字符
          str = str.slice(1)
        } else if (char === '>') {
          // 1. 遇到字符 >，切换到初始状态
          currentState = State.initial
          // 2. 从 结束标签名称状态 --> 初始状态，应该保存结束标签名称 Token
          // 注意，此时 chars 数组中缓存的内容就是标签名称
          tokens.push({
            type: 'tagEnd',
            name: chars.join('')
          })
          // 3. chars 数组的内容已经被消费，清空它
          chars.length = 0
          // 4. 消费当前字符
          str = str.slice(1)
        }
        break
    }
  }

  // 最后，返回 tokens
  return tokens
}

function parse(str) {
  const tokens = tokenize(str);
  const root = {
    type: 'Root',
    children: [],
  }
  const elementStack = [root]; // 维护元素的父子关系
  while(tokens.length) {
    const parent = elementStack[elementStack.length - 1];
    const t = tokens[0]; // 当前扫描的 token

    switch(t.type) {
      case 'tag': 
        const elementNode = {
          type: 'Element',
          tag: t.name,
          children: [],
        }
        // 添加到父节点的 children 中
        parent.children.push(elementNode);
        // 将当前节点压入栈，为什么？
        elementStack.push(elementNode);
        break;
      case 'text':
        const textNode = {
          type: 'Text',
          content: t.content,
        }
        parent.children.push(textNode);
        break;
      case 'tagEnd': 
        elementStack.pop(); // elementStack 做什么用？？
        break;
    }

    tokens.shift(); // 已经消耗的 token 删除
  }

  return root;
}

function dump(node, indent = 0) {
  const type = node.type;
  const desc = node.type === 'Root'
    ? ''
    : node.type === 'Element'
      ? node.tag
      : node.content
  console.log(`${'-'.repeat(indent)}${type} : ${desc}`);
  if (node.children) {
    node.children.forEach( node => {
      dump(node, indent + 2);
    });
  }
}
function traverseNode(node, context) {
  context.currentNode = node;
  const transforms = context.nodeTransforms;
  for (let i = 0; i < transforms.length; i++) {
    transforms[i](context.currentNode, context);
    // 由于任何转换函数都可能移除当前节点，所以每次做完转换，需要检查。
    if (context.currentNode === null) return;
  }
  const children = context.currentNode.children;

  children && children.forEach((node, index) => {
    context.childrenIndex = index;
    context.parent = context.currentNode;
    traverseNode(node, context);
  });
}

function transformElement(node, context) {
  if (node.type === 'Element' && node.tag === 'p') {
    node.tag = 'h1';
  }
}
function transformText(node, context) {
  if (node.type === 'Text') {
    // node.content = node.content.repeat(2);
    context.replaceNode({
      type: 'Element',
      tag: 'span'
    })
  }
}

function transform(ast) {
  const context = { // 在 transform 过程中，可能需要一些可共享数据
    currentNode: null, // 存储当前被转换的节点
    childrenIndex: -1, // 当前被转换节点的在父元素中的位置
    parent: null,      // 父元素节点
    replaceNode(node) {
      context.parent.children[context.childrenIndex] = node;
      context.currentNode = node;
    },
    removeNode() {     // 移除当前节点
      // splice(start, deleteCount, item1, item2, /* …, */ itemN)
      context.parent.children.splice(context.childrenIndex, 1);
      context.currentNode = null;
    },
    nodeTransforms: [
      transformElement, // 转换标签节点
      transformText,    // 转换文本节点
    ]
  };
  traverseNode(ast, context);
  dump(ast);
}

const ast = parse(`<div><p>Vue</p><p>Template</p></div>`)
transform(ast);



