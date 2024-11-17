const userInfo = {
  name: 'denny',
  userID: '12',
}

const personal = {
  isLogin : true,
  userInfo: {
    name: 'jenny',
    nick: 'cat-dog'
  }
}

function handleShow() {
  const { isLogin, userInfo } = personal;

  if (isLogin) {
    const { name, nick } = userInfo;
    userInfo.name = name;
    userInfo.nick = '0000';
  }
}

function handleShow2() {
  const { isLogin, userInfo: storeUserInfo } = personal;

  if (isLogin) {
    const { name, nick } = storeUserInfo;
    userInfo.name = name;
    userInfo.nick = '0000';
  }
}

handleShow();

console.log(userInfo);
console.log(personal);

