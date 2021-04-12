import request from '@/utils/request'

export const getMemberLevel = params => {
    return request({
        url: '/memberLevel/list',
        params: params
    })
}