const vnode = {
  type: 'div',
  props: {
    // class input:

    // class: 'foo bar',
    // class: ['foo', 'bar', {baz: true}],
    class: {
      foo: true, 
      bar: false
    }
    // class output: 'a, b, c'
  }
}

{/* <div class="active text-danger"></div> */}
{/* <div :class="['activeClass', 'errorClass']"></div> */}
{/* <div :class="[isActive ? activeClass : '', 'errorClass']"></div> */}
{/* <div :class="[{ activeClass: isActive }, 'errorClass']"></div> */}
{/* <div class="static :class="{ active: isActive, 'text-danger': hasError }"></div> */}

// const res = [];
const isActive = true;
const hasError = true;

function normalizeClass(classValue, res = []) {
  if (typeof classValue === 'string') return classValue;
  else if (Array.isArray(classValue)) {
    classValue.forEach(item => {
      res.push(normalizeClass(item, res));
    })
  } else if (typeof classValue === 'object') {
    for (const key in classValue) {
      if (Object.hasOwnProperty.call(classValue, key)) {
        if (classValue[key]) res.push(key);
      }
    }
  }
  return res.join(' ');
}
const test1 = "active text-danger"
const test2 = ['activeClass', 'errorClass']
const test3 = [isActive ? 'activeClass' : '', 'errorClass']
const test4 = { active: isActive, 'text-danger': hasError }
console.log(normalizeClass(test1));
console.log(normalizeClass(test2));
console.log(normalizeClass(test3));
console.log(normalizeClass(test4));