import request from '@/utils/request';

//get
export const getAction = (url, parameter) => {
    return request({
        url: url,
        params: parameter
    })
}

//post 
export const postAction = (url, parameter) => {
    return request({
        url: url,
        method: 'POST',
        data: parameter
    })
}

