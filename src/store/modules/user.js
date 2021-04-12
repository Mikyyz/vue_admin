import { login, logout, getUserInfo } from '@/api/user'
import {
    SET_TOKEN,
    SET_ROLES,
    SET_USERNAME,
    SET_AVATAR
} from '../mutation-types';
import {
    setToken,
    getToken,
    removeToken
} from '@/utils/auth'

const user = {
    state: {
        token: getToken(),
        roles: [],
        name: '',
        avatar: ''
    },
    mutations: {
        [SET_TOKEN]: (state, token) => {
            state.token = token;
        },
        [SET_ROLES]: (state, roles) => {
            state.roles = roles;
        },
        [SET_USERNAME]: (state, name) => {
            state.name = name;
        },
        [SET_AVATAR]: (state, avatar) => {
            state.avatar = avatar;
        }
    },
    actions: {
        //登录
        Login({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                login(userInfo).then(res => {
                    if (res.data.code === 200) {
                        console.log(res);
                        const { token, tokenHead } = res.data.data;
                        const tokenStr = `${tokenHead}${token}`;
                        //登录成功存储token
                        setToken(tokenStr);
                        commit(SET_TOKEN, tokenStr);
                    }
                    resolve(res);
                }).catch(error => {
                    reject(error)
                }) 
            })
        },
        //退出
        Logout({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    //提交mutations,清空token和权限列表
                    commit(SET_TOKEN, '');
                    //并且清除cookie中的数据
                    removeToken();
                    resolve();
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //获取用户信息
        GetInfo({commit}) {
            return new Promise((resolve, reject) => {
                getUserInfo().then(res => {
                    const { icon, roles, username } = res.data.data;
                    if (roles && roles.length > 0) {
                        // 验证返回的roles是否是一个非空数组
                        commit(SET_ROLES, roles);
                    } else {
                        reject('getInfo: roles must be a non-null array !')
                    }
                    commit(SET_USERNAME, username)
                    commit(SET_AVATAR, icon);
                    resolve(res);
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
}

export default user;