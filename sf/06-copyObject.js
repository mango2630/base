const obj = {
    name: 'denny',
    school: [1, 2, 3],
    relate: {
        big: 'bigger',
        parent: 'parents'
    }
}

const obj1 = obj; // 浅拷贝，拷贝的是对象地址的引用
// obj1.name = 'joy';
// console.log(obj, obj1);

const obj2 = JSON.parse(JSON.stringify(obj)); // 深拷贝，序列化处理。
// obj2.name = 'obj2name';
// obj2.relate.big = 'small';
// console.log(obj, obj2);


// way3: Object.assign(target, source...) 浅拷贝
// - 将一个或者多个源对象中【所有可枚举的自有属性】复制到目标对象，并返回修改后的目标对象。
const obj3 = Object.assign({}, obj1);
// obj3.name = 'obj3name';
// obj3.relate.big = 'obj3big'; // 会修改原对象
// obj3.school = [4, 5];
// console.log(obj, obj3);

// way4: 扩展运算符 浅拷贝
const obj4 = {...obj};
// obj4.name = 'obj4name';
// obj4.relate.big = 'obj4big'; // 会修改原对象
// obj4.school = [4, 5];
// obj4.school.push('obj4arr');
// console.log(obj, obj4);


// way5: Object.create(protoObj, propertiesObject) 浅拷贝/不算拷贝
// - 以一个现有对象作为原型，创建一个新对象。
// const obj5 = Object.create(obj);
// obj5.name = 'obj5name';
// obj5.relate.big = 'obj5big'; // 会修改原对象值，且该属性属于圆形对象上面
// console.log(obj, obj5);

// way6: 自己实现 递归拷贝
// 拷贝对象和数组自身的每一层
// hasOwnProperty() 方法返回一个布尔值，表示对象自有属性（而不是继承来的属性）中是否具有指定的属性。
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof
// typeof null => object

function deepCopy(obj) {
    if (obj === null) return null;           // 空对象
    if (typeof obj !== 'object') return obj; // 不是复杂类型，直接返回

    const targetObj = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            targetObj[key] = deepCopy(obj[key]);
        }
    }
}

console.log(obj, obj5);