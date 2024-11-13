const options = {
  groupID: {
    text: {
      age: null
    }
  }
}

const {groupID: {text}} = options;
const {age: 12} = text

console.log(typeof text, text['a'] && 12, age);