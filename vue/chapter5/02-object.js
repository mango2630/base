const obj = {
  name: 'denny',
}

console.log(obj);

effect(() => {
  'age' in obj
})