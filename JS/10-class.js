'use strict'

class Person {
  constructor() {
    console.log('constructor-this', this); // Person {}
  }

  initPerson(name, age) {
    this.name = name;
    this.age = age;
  }
  showName() {
    console.log(this.name);
  }

  showAge() {
    console.log('showAge-this', this);
    this.handleAge();
    console.log(this.age);
  }

  handleAge() {
    this.age++;
  }
}

const person = new Person();
person.initPerson('zhangsan', 20);
person.showName();
person.showAge();