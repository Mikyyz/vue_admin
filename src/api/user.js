import request from '@/utils/request';

//登录
export const login = parameter => {
    return request({
        url: '/admin/login',
        method: 'POST',
        data: parameter
    })
}

//获取用户信息
export const getUserInfo = () => {
    return request({
        url: '/admin/info'
    })
}

//退出登录
export const logout = () => {
    return request({
        url: '/admin/logout',
        method: 'POST'
    })
}

//获取用户列表
export const getUsersList = params => {
    return request({
        url: '/admin/list',
        params
    })
}

//更新用户信息
export const updateUser = (id, data) => {
    return request({
        url: '/admin/update/' + id,
        method: 'post',
        data
    })
}

//新增用户
export const addUser = data => {
    return request({
        url: '/admin/register',
        method: 'post',
        data
    })
}

//删除用户
export const deleteUser = id => {
    return request({
        url: '/admin/delete/' + id,
        method: 'post'
    })
}

//更新是否启用用户
export const updateStatus = (id, params) => {
    return request({
        url: '/admin/updateStatus/' + id,
        method: 'post',
        params: params
    })
}

//根据用户id获取角色
export const getRoleByUserId = id => {
    return request({
        url: '/admin/role/' + id
    })
}