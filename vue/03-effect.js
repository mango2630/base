let val = 1;

function  effect () {
  val = 2; // 修改全局变量，产生副作用
}

const obj = { text: 'hello world' }
function effect() {
  // effect 函数的执行会读取 obj.text
  document.body.innerText = obj.text
}

obj.text = 12;