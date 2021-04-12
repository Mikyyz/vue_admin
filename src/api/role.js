import request from '@/utils/request';

export const getAllRoleList = () => {
    return request({
        url: '/role/listAll'
    })
}

//获取角色列表
export const getRoleList = params => {
    return request({
        url: '/role/list',
        params
    })
}

//分配角色
export const allocRole = data => {
    return request({
        url: '/admin/role/update',
        method: 'post',
        data
    })
}

//新增角色
export const addRole = data => {
    return request({
        url: '/role/create',
        method: 'post',
        data
    })
}

//编辑角色
export const updateRole = (id, data) => {
    return request({
        url: '/role/update/' + id,
        method: 'post',
        data
    })
}

//删除角色
export const deleteRole = data => {
    return request({
        url: '/role/delete',
        method: 'post',
        data
    })
}

//是否启用角色
export const updateStatus = (id, params) => {
    return request({
        url: '/role/updateStatus/' + id,
        method: 'post',
        params
    })
}