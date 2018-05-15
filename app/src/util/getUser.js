import fetch from './prelogin.js';

export function getUser(username, password) {
  let formData = new FormData();
  formData.append("userName",username);
  formData.append('pwd',password);
  return fetch({
    url: '/login',
    method: 'post',
    mode:'cors',
    data: formData
  });
}