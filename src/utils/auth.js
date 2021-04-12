import store from 'store';

const USERTOKEN = 'user_token';
const USERNAME = 'username';
const USERAVATAR = 'user_avatar'

//获取token
export const getToken = () => store.get(USERTOKEN)

//设置token
export const setToken = token => store.set(USERTOKEN, token)

//移除token
export const removeToken = () => store.remove(USERTOKEN)

//获取username
export const getUsername = () => store.get(USERNAME)

//存储username
export const setUsername = username => store.set(USERNAME, username)

//移除username
export const removeUsername = () => store.remove(USERNAME)

//设置头像
export const setUserAvatar = avatar => store.set(USERAVATAR, avatar)

//获取头像
export const getUserAvatar = () => store.get(USERAVATAR)