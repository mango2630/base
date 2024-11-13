function SuperType(name) {
    this.colors = ["red", "blue", "green"]; // 原型中的变量会共享
    this.name = name;
}
SuperType.prototype.sayName = function() {}

function SubType() {
    this.ages = [1, 2]; // 构造函数中的变量不会共享
    SuperType.call(this, 'testName');
}


SubType.prototype = new SuperType();
SubType.prototype.sayAge = function() {};

let instance1 = new SubType(); 
instance1.colors.push("black"); 
instance1.ages.push(33); 
console.log(instance1.colors, instance1.ages); 

let instance2 = new SubType(); 
console.log(instance2.colors, instance2.ages); 