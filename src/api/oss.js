import request from '@/utils/request'
export const policy = () => {
    return request({
        url: '/aliyun/oss/policy'
    })
}