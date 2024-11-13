function jsonToString(obj) {
    if (typeof obj === 'undefined') return undefined;
    if (typeof obj === 'string') return `"${obj}"`;
    if (typeof obj === 'number' || typeof obj === 'boolean' || obj === null ) {
        return String(obj);
    }
    if (Array.isArray(obj)) {
        const arrJson = obj.map(item => jsonToString(item));
        return `[${arrJson.join(',')}]`;
    }
    if (typeof obj === 'object') {
        const res = []
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const valueStr = jsonToString(obj[key]);
                res.push(`"${key}":${valueStr}`);
            }
        }
        return `{ ${res.join(',')} }`;
    }
}

const jsonArr = [1, 2, [3, 4, 5, [3333, 'dd', {name: 'denny', age: {xx: '12'}}], true]];
const jsonObj = {
    name: 'denny',
    city: ['sh', 'bj', 'xa'],
    info: {
        age: 12,
        school: {}
    }
}

