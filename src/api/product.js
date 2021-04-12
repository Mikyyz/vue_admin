import request from '@/utils/request';

// 获取商品列表
export const getProductList = params => {
    return request({
        url: '/product/list',
        params
    })
}
//获取商品列表,用于级联选择
export const getProductListWithChildren = () => {
    return request({
        url: '/productCategory/list/withChildren'
    })
}

//获取品牌列表
export const getBrandList = params => {
    return request({
        url: '/brand/list',
        params
    })
}

//根据id删除某品牌
export const deleteBrandById = id => {
    return request({
        url: '/brand/delete/'+id
    })
}

//删除某商品
export const updateDeleteStatus = params => {
    return request({
        url: '/product/update/deleteStatus',
        method: 'post',
        params
    })
}

//更新品牌的显示状态
export const updateBrandShowStatus = data => {
    return request({
        url: '/brand/update/showStatus',
        method: 'post',
        data
    })
}

//根据商品id获取产品信息
export const getProductInfo = id => {
    return request({
        url: '/product/updateInfo/'+id
    })
}
//获取商品属性列表
export const getproductAttributeList = params => {
    return request({
        url: '/productAttribute/category/list',
        params
    })
}

//根据商品Cid获取相关产品属性列表
export const getProductAttributeById = (cid, params) => {
    return request({
        url: '/productAttribute/list/' + cid,
        params
    })
}
//更新商品上架/下架状态
export const updatePublishStatus = params => {
    return request({
        url: '/product/update/publishStatus',
        methods: 'post',
        params
    })
}

//获取商品分类
export const getProductCateList = (parentId, params) => {
    return request({
        url: '/productCategory/list/' + parentId,
        params
    }) 
}

//更新导航栏状态
export const updateNavStatus = data => {
    return request({
        url: '/productCategory/update/navStatus',
        method: 'post',
        data
    })
}

//更新显示状态
export const updateShowStatus = data => {
    return request({
        url: '/productCategory/update/showStatus',
        method: 'post',
        data
    })
}

//删除商品分类
export const deleteProductCate = id => {
    return request({
        url: '/productCategory/delete/' + id,
        method: 'post'
    })
}
//获取商品关联专题列表
export const getSubjectRelationList = () => {
    return request({
        url: '/subject/listAll'
    })
}
//获取商品优选关联的列表
export const getPrefrenceAreaList = () => {
    return request({
        url: '/prefrenceArea/listAll'
    })
}
