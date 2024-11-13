const obj = {};

function update() {
    console.log('obj.foo更新了', obj.foo)
}

function defineReactive(obj, key, value) {
    Object.defineProperty(obj, key, {
        get() {
            return obj[key]
        },
        set(newValue) {
            if (newValue !== value) {
                // value = newValue;
                obj[key] = newValue;
                update()
            }
        }
    })
}

