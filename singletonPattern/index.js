/**
 * 单例模式：全局只有一个实例。
 *   1. 饿汉模式(eager initialization)，即在初始阶段就主动进行实例化，并时刻保持一种渴求的状态，无论此单例是否有人使用。
 *   2. 饱汉模式，需要的时候再创建。（JS 单线程，不用担心被创建很多实例。）
 */

class Person {
    static instance = null;

    constructor(name) {
        this.name = name;
        // console.log(this);
        if (!Person.instance) {
            Person.instance = this;
        }
        return Person.instance;
    }

    static getInstance(name) {
        if (!Person.instance) {
            Person.instance = new Person(name);
        }
        return Person.instance;
    }
}

const person1 = Person.getInstance('denny');
const person2 = new Person('bonny');
console.log(person1 === person2, person1, person2);


function Singleton(name) {
    this.name = name;
    if (!Singleton.instance) {
        Singleton.instance = this;
    }
    return Singleton.instance;
}
Singleton.prototype.getName = function () {
    return this.name;
}
Singleton.prototype.instance = null;
Singleton.getInstance = function(name) {
    if (!Singleton.instance) {
        Singleton.instance = new Singleton(name);
    }
    return Singleton.instance;
}

const p1 = new Singleton('11')
const p2 = Singleton.getInstance('22');
console.log(p1 === p2);


// https://blog.csdn.net/a_little_fly/article/details/125588169
// const obj = {};
// obj = Object.create(Person.prototype); // obj.__proto__ = Person.prototype | Object.create 会返回一个新的对象
// let result = Person.call(obj); // 执行构造函数 | 返回值：使用指定的 this 值和参数调用函数后的结果。
// return result === Object ? result : obj;

