// 验证 constructor 时，能否调用实例方法

class Person {
  name = 'denny';
  age = '12';

  constructor(name, age) {
    this.name = name;
    this.age = age;
    this.show();
  }

  show() {
    console.log('info', this.name, this.age);
  }
}

const p = new Person('natural', 18);

/**
 * 
 * 在 JavaScript 中，new 关键字用于创建一个对象的实例。当你使用 new 关键字调用一个构造函数（如 Person）时，以下步骤会依次执行：
 * 1. 创建一个新的空对象：一个新的空对象被创建，并且这个对象会被 this 关键字引用。
 * 2. 设置原型链：新创建的对象的原型（__proto__）会被设置为构造函数的 prototype 属性。
 * 3. 执行构造函数：构造函数内部的代码开始执行，此时 this 指向新创建的对象。
 * 4. 返回新对象：如果构造函数没有显式返回一个对象，则自动返回新创建的对象。
 * 
 * ==> 先设置原型链，在执行构造函数
 */

