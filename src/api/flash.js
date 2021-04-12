import request from '@/utils/request';

//获取活动列表
export const getFlashList = params => {
    return request({
        url: '/flash/list',
        params
    })
}

//删除某项活动
export const deleteFlashById = id => {
    return request({
        url: '/flash/delete/' + id,
        method: 'post'
    })
}

//更新活动
export const updateFlash = (id, data) => {
    return request({
        url: '/flash/update/' + id,
        method: 'post',
        data: data
    })
}

//更新上线/下线状态
export const updateStatus = (id, params) => {
    return request({
        url: '/flash/update/status/' + id,
        method: 'post',
        params
    })
}