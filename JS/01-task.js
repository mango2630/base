// 1 p 3 5 

console.log(1);

const p = Promise.resolve(2);
console.log(p);
console.log(3);

p.then(() => {
  console.log('4');
}).finally(() => {
  console.log(6);
})

console.log(5);

