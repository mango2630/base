const arr = [
    {parent: 5, id: 4, value: 22},
    {parent: null, id: 1, value: 882},
    {parent: 1, id: 2, value: 22},
    {parent: 1, id: 3, value: 32},
    {parent: 2, id: 5, value: 88},
]

const result = [
    {
        id: 1,
        value: 22,
        children: [
            {
                id: 2,
                value: 22,
                children: [] // ...
            },
            {
                id: 3,
                value: 32,
                children: [] // ...
            }
        ]
    }
]

function formatTree(arr, parent = null) {
    const resultArr = [];
    for (const obj of arr) {
        if (obj.parent === parent) {
            const children = formatTree(arr, obj.id);
            if (children.length > 0) {
                resultArr.push({
                    id: obj.id,
                    value: obj.value,
                    children: children
                })
            } else {
                resultArr.push({
                    id: obj.id,
                    value: obj.value,
                })
            }
        }
    }

    return resultArr;
}

console.log(formatTree(arr));