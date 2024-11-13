function myParse(jsonString) {
  // 去除字符串两端的空格
  jsonString = jsonString.trim();

  // 检查字符串是否以 '{' 开头和 '}' 结尾
  if (jsonString[0] !== '{' || jsonString[jsonString.length - 1] !== '}') {
    throw new SyntaxError('Invalid JSON');
  }

  // 去除 '{' 和 '}'，获取对象内容
  jsonString = jsonString.slice(1, -1);

  // 分割字符串为键值对数组
  const keyValuePairs = jsonString.split(',');
  console.log('keyValuePairs', keyValuePairs, jsonString);

  // 创建一个空对象，用于存储解析后的键值对
  const obj = {};

  // 遍历键值对数组
  for (let pair of keyValuePairs) {
    // 分割键值对为键和值
    const [key, value] = pair.split(':');

    // 去除键和值两端的空格，并去除引号（如果有）
    const parsedKey = key.trim().replace(/"/g, '');
    const parsedValue = value.trim().replace(/"/g, '');

    // 将解析后的键值对添加到对象中
    obj[parsedKey] = parsedValue;
  }

  return obj;
}

// 示例用法
const jsonString = '{"name": "John", "age": 30, "city": "New York"}';
const obj = myParse(jsonString);
console.log(obj);