const person = {
    name: 12,
}

Object.defineProperty(person, "age", {
    enumerable: false,
    configurable: false,
    value: 22,
    writable: false
})


console.log("age" in person);

for (const key in person) {
    console.log(key); // name
}


