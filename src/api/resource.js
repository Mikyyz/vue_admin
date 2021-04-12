import request from '@/utils/request';

// 获取资源列表
export const getResourceList = params => {
    return request({
        url: '/resource/list',
        params
    })
}

//新增资源
export const addResource = data => {
    return request({
        url: '/resource/create',
        method: 'post',
        data
    })
}

//编辑资源
export const updateResource = (id, data) => {
    return request({
        url: '/resource/update/' + id,
        method: 'post',
        data
    })
}