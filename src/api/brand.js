import request from '@/utils/request';

export const getHomeBrandList = params => {
    return request({
        url: '/home/brand/list',
        params
    })
}

//根据id删除品牌
export const deleteBrand = data => {
    return request({
        url: '/home/brand/delete',
        method: 'post',
        data
    })
}

//更新品牌排序
export const updateBrandSort = (params, id) => {
    return request({
        url: '/home/brand/update/sort/' + id,
        method: 'post',
        params
    })
}

//更新品牌推荐状态
export const updateRecommendStatus = data => {
    return request({
        url: '/home/brand/update/recommendStatus',
        method: 'post',
        data
    })
}