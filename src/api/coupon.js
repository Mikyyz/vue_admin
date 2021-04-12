import request from '@/utils/request';

//获取优惠券列表
export const getCouponList = params => {
    return request({
        url: '/coupon/list',
        params
    })
}

//删除某项优惠券
export const deleteCoupon = id => {
    return request({
        url: '/coupon/delete/' + id,
        method: 'post'
    })
}