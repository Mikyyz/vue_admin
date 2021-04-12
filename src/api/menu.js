import request from '@/utils/request'

// 获取菜单列表
export const getMenuList = (parentId, params) => {
    return request({
        url: '/menu/list/' + parentId,
        params
    })
}    

//删除菜单
export const deleteMenu = id => {
    return request({
        url: '/menu/delete/' + id,
        method: 'post'
    })
}  

//设置菜单是否显示
export const settingMenuShow = (id, params) => {
    return request({
        url: '/menu/updateHidden/' + id,
        method: 'post',
        params
    })
} 