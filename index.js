const groupAttributes = {
  'inner_attr_kit_info': JSON.stringify({
    room_id: '',
    group_id: '',
  })
}
// const res = groupAttributes['inner_attr_kit_info'] && JSON.parse(groupAttributes['inner_attr_kit_info'])

// const {room_id} = res;

const groupAttributesQ = {}

// const resQ = (groupAttributesQ['inner_attr_kit_info'] || {}) 
// & JSON.parse(groupAttributesQ['inner_attr_kit_info'])

const resQ = groupAttributesQ['inner_attr_kit_info'] ? JSON.parse(groupAttributesQ['inner_attr_kit_info']) : {}
// console.log('====', obj);
// const resQ = JSON.parse(obj)

// const {room_id: roomID = '', userList:aa = userList ? userList : []} = resQ;
// console.log(roomID, aa);

// const {a, b} = {}
// console.log(a, b);

function isEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  if (typeof value === 'object' && JSON.stringify(value) === "{}") {
    return true;
  }

  return false;
};

console.log(isEmpty({name: '12'}));