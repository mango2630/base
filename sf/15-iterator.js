const myIterable = {
    // i: 0,
    [Symbol.iterator]() {
        return {
            i: 0,
            next() {
                if (this.i < 3) {
                    return {
                        value: this.i ++,
                        done: false
                    }
                } else {
                    return {
                        value: undefined,
                        done: true
                    }
                }
            }
        }
    },
  };

console.log([...myIterable]); // [1, 2, 3]

let arr = [1,2,3];
arr[Symbol.iterator]();

console.log(myIterable[Symbol.iterator]());
  
