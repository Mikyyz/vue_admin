import { constantRouterMap, asyncRouterMap } from '@/config/router.config';
import { SET_MENUS } from '../mutation-types'

//判断是否有权限访问该菜单
function hasPermission(menus, route) {
    if (route.name) {
        let currMenu = getMenu(route.name, menus);
        if (currMenu != null) {
            //设置菜单的标题、图标和可见性
            if (currMenu.title != null && currMenu.title !== '') {
                route.meta.title = currMenu.title;
            }
            if (currMenu.icon != null && currMenu.title !== '') {
                route.meta.icon = currMenu.icon;
            }
            if (currMenu.hidden != null) {
                route.hidden = currMenu.hidden !== 0;
            }
            if (currMenu.sort != null && currMenu.sort !== '') {
                route.sort = currMenu.sort;
            }
            return true;
        }
    } else {
        return true
    }
}

//根据路由名称获取菜单
function getMenu(name, menus) {
    for (let i = 0; i < menus.length; i++) {
        let menu = menus[i];
        if (name === menu.name) {
            return menu;
        }
    }
    return null;
}
const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: []
    },
    mutations: {
        [SET_MENUS]: (state, routers) => {
            state.addRouters = routers;
            state.routers = constantRouterMap.concat(routers);
        }
    },
    actions: {
        GenerateRoutes({ commit }, data) {
            return new Promise(resolve => {
                const { menus } = data;
                const accessedRouters = asyncRouterMap.filter(v => {
                    //admin帐号直接返回所有菜单
                    // if(username==='admin') return true;
                    if (hasPermission(menus, v)) {
                        if (v.children && v.children.length > 0) {
                            v.children = v.children.filter(child => {
                                if (hasPermission(menus, child)) {
                                    return child
                                }
                                return false;
                            });
                            return v
                        } else {
                            return v
                        }
                    }
                    return false;
                });
                commit(SET_MENUS, accessedRouters)
                resolve();
            })
        }
    }
};

export default permission;
