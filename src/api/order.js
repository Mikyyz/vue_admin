import request from '@/utils/request'

//获取订单列表
export const getOrderList = params => {
    return request({
        url: '/order/list',
        params
    })
}

//删除某订单
export const deleteOrder = params => {
    return request({
        url: '/order/delete',
        methods: 'post',
        params
    })
}

//关闭订单后提交操作
export const closeOrder = params => {
    return request({
        url: '/order/update/close',
        methods: 'post',
        params
    })
}

//获取订单设置数据
export const getOrderSetting = id => {
    return request({
        url: '/orderSetting/' + id
    })
}

//更行订单设置
export const updateOrderSetting = (id, data) => {
    return request({
        url: '/orderSetting/update/' + id,
        method: 'post',
        data
    })
}

//获取退货订单列表
export const getReturnOrderList = params => {
    return request({
        url: '/returnApply/list',
        params
    })
}

//删除退货订单
export const deleteReturnOrder = params => {
    return request({
        url: '/returnApply/delete',
        methods: 'post',
        params
    })
}

//获取退货原因列表
export const getReturnOrderReasonList = params => {
    return request({
        url: '/returnReason/list',
        params
    })
}

//根据id获取退货原因详情
export const getReturnReasonDeatil = id => {
    return request({
        url: '/returnReason/' + id
    })
}
//添加退货原因
export const addReturnReason = data => {
    return request({
        url: '/returnReason/create',
        method: 'post',
        data
    })
}

//更新退货原因
export const updateReturnReason = (data, id) => {
    return request({
        url: '/returnReason/update/' + id,
        method: 'post',
        data
    })
}

//更改退货原因中是否可用一项
export const updateOrderReasonStatus = params => {
    return request({
        url: '/returnReason/update/status',
        method: 'post',
        params
    })
}
//删除某项或多项退货原因
export const deleteOrderReturn = params => {
    return request({
        url: '/returnReason/delete',
        method: 'post',
        params
    })
}
