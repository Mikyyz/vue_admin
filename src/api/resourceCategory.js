import request from '@/utils/request'

// 获取资源分类列表
export const getResourceCategoryList = () => {
    return request({
        url: '/resourceCategory/listAll',
    })
}    
