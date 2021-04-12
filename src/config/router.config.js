import Layout from '../views/layout/Layout'

export const constantRouterMap = [
    {
        path: '',
        component: Layout,
        redirect: '/home',
        children: [{
            path: 'home',
            name: 'home',
            component: () => import('@/views/home/index'),
            meta: { title: '首页', icon: 'home' }
        }]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/user/login'),
        meta: { title: '登录' },
        hidden: true
    },
]

export const asyncRouterMap = [
    {
        path: '/pms',
        component: Layout,
        redirect: '/pms/product',
        name: 'pms',
        meta: { title: '商品', icon: 'shopping' },
        children: [
            {
                path: 'product',
                name: 'product',
                component: () => import('@/views/pms/product/index'),
                meta: { title: '商品列表', icon: 'menu', perssion: ['pms']}
            },
            {
                path: 'addProduct',
                name: 'addProduct',
                component: () => import('@/views/pms/product/add'),
                meta: { title: '添加商品', icon: 'plus-square', perssion: ['pms']},
            },
            {
                path: 'updateProduct',
                name: 'updateProduct',
                component: () => import('@/views/pms/product/update'),
                meta: { title: '修改商品', perssion: ['pms'] },
                hidden: true
            },
            {
                path: 'productCate',
                name: 'productCate',
                component: () => import('@/views/pms/productCate/index'),
                meta: { title: '商品分类', icon: 'appstore', perssion: ['pms']}
            },
            {
                path: 'addProductCate',
                name: 'addProductCate',
                component: () => import('@/views/pms/productCate/add'),
                meta: { title: '添加商品分类', perssion: ['pms'] },
                hidden: true
            },
            {
                path: 'updateProductCate',
                name: 'updateProductCate',
                component: () => import('@/views/pms/productCate/update'),
                meta: { title: '修改商品分类', perssion: ['pms'] },
                hidden: true
            },
            {
                path: 'productAttr',
                name: 'productAttr',
                component: () => import('@/views/pms/productAttr/index'),
                meta: { title: '商品类型', icon: 'gold', perssion: ['pms'] }
            },
            {
                path: 'productAttrList',
                name: 'productAttrList',
                component: () => import('../views/pms/productAttr/productAttrList'),
                meta: { title: '商品属性列表', perssion: ['pms'] },
                hidden: true
            },
            {
                path: 'addProductAttr',
                name: 'addProductAttr',
                component: () => import('../views/pms/productAttr/addProductAttr'),
                meta: { title: '添加商品属性', perssion: ['pms'] },
                hidden: true
            },
            {
                path: 'updateProductAttr',
                name: 'updateProductAttr',
                component: () => import('@/views/pms/productAttr/updateProductAttr'),
                meta: { title: '修改商品属性', perssion: ['pms'] },
                hidden: true
            },
            {
                path: 'brand',
                name: 'brand',
                component: () => import('@/views/pms/brand/index'),
                meta: { title: '品牌管理', icon: 'tag', perssion: ['pms'] }
            },
            {
                path: 'addBrand',
                name: 'addBrand',
                component: () => import('@/views/pms/brand/add'),
                meta: { title: '添加品牌', perssion: ['pms'] },
                hidden: true
            },
            {
                path: 'updateBrand',
                name: 'updateBrand',
                component: () => import('@/views/pms/brand/update'),
                meta: { title: '编辑品牌', perssion: ['pms'] },
                hidden: true
            }
        ]
    },
    {
        path: '/oms',
        component: Layout,
        redirect: '/oms/order',
        name: 'oms',
        meta: { title: '订单', icon: 'profile', perssion: ['oms'] },
        children: [
            {
                path: 'order',
                name: 'order',
                component: () => import('@/views/oms/order/index'),
                meta: { title: '订单列表', icon: 'menu', perssion: ['oms'] },
            },
            {
                path: 'orderDetail',
                name: 'orderDetail',
                component: () => import('@/views/oms/order/orderDetail'),
                meta: { title: '订单详情', perssion: ['oms'] },
                hidden: true
            },
            {
                path: 'deliverOrderList',
                name: 'deliverOrderList',
                component: () => import('@/views/oms/order/deliverOrderList'),
                meta: { title: '发货列表', perssion: ['oms'] },
                hidden: true
            },
            {
                path: 'orderSetting',
                name: 'orderSetting',
                component: () => import('@/views/oms/order/setting'),
                meta: { title: '订单设置', icon: 'setting', perssion: ['oms'] }
            },
            {
                path: 'returnApply',
                name: 'returnApply',
                component: () => import('@/views/oms/apply/index'),
                meta: { title: '退货申请处理', icon: 'import', perssion: ['oms'] }
            },
            {
                path: 'returnReason',
                name: 'returnReason',
                component: () => import('@/views/oms/apply/reason'),
                meta: { title: '退货原因设置', icon: 'exception', perssion: ['oms'] }
            },
            {
                path: 'returnApplyDetail',
                name: 'returnApplyDetail',
                component: () => import('@/views/oms/apply/applyDetail'),
                meta: { title: '退货原因详情', perssion: ['oms'] },
                hidden: true
            }
        ]
    },
    {
        path: '/sms',
        component: Layout,
        redirect: '/sms/coupon',
        name: 'sms',
        meta: { title: '营销', icon: 'account-book', perssion: ['sms'] },
        children: [
            {
                path: 'flash',
                name: 'flash',
                component: () => import('@/views/sms/flash/index'),
                meta: { title: '秒杀活动列表', icon: 'calendar', perssion: ['sms'] }
            },
            {
                path: 'flashSession',
                name: 'flashSession',
                component: () => import('@/views/sms/flash/sessionList'),
                meta: { title: '秒杀时间段列表', perssion: ['sms'] },
                hidden: true
            },
            {
                path: 'selectSession',
                name: 'selectSession',
                component: () => import('@/views/sms/flash/selectSessionList'),
                meta: { title: '秒杀时间段选择', perssion: ['sms'] },
                hidden: true
            },
            {
                path: 'flashProductRelation',
                name: 'flashProductRelation',
                component: () => import('@/views/sms/flash/productRelationList'),
                meta: { title: '秒杀商品列表', perssion: ['sms'] },
                hidden: true
            },
            {
                path: 'coupon',
                name: 'coupon',
                component: () => import('@/views/sms/coupon/index'),
                meta: { title: '优惠券列表', icon: 'credit-card', perssion: ['sms'] }
            },
            {
                path: 'addCoupon',
                name: 'addCoupon',
                components: () => import('@/views/sms/coupon/add'),
                meta: { title: '添加优惠券', perssion: ['sms'] },
                hidden: true
            },
            {
                path: 'updateCoupon',
                name: 'updateCoupon',
                component: () => import('@/views/sms/coupon/update'),
                meta: { title: '修改优惠券', perssion: ['sms'] },
                hidden: true
            },
            {
                path: 'couponHistory',
                name: 'couponHistory',
                component: () => import('@/views/sms/coupon/history'),
                meta: { title: '优惠券领取详情', perssion: ['sms'] },
                hidden: true
            },
            {
                path: 'brand',
                name: 'brand',
                component: () => import('@/views/sms/brand/index'),
                meta: { title: '品牌推荐', icon: 'tag', perssion: ['sms'] }
            },
            {
                path: 'new',
                name: 'new',
                component: () => import('@/views/sms/new/index'),
                meta: { title: '新品推荐', icon: 'crown', perssion: ['sms'] }
            },
            {
                path: 'hot',
                name: 'hot',
                component: () => import('@/views/sms/hot/index'),
                meta: { title: '人气推荐', icon: 'fire', perssion: ['sms'] }
            },
            {
                path: 'subject',
                name: 'subject',
                component: () => import('@/views/sms/subject/index'),
                meta: { title: '专题推荐', icon: 'project', perssion: ['sms'] }
            },
            {
                path: 'advertise',
                name: 'advertise',
                component: () => import('@/views/sms/advertise/index'),
                meta: { title: '广告列表', icon: 'save', perssion: ['sms'] }
            },
            {
                path: 'addAdvertise',
                name: 'addAdvertise',
                component: () => import('@/views/sms/advertise/add'),
                meta: { title: '添加广告', perssion: ['sms'] },
                hidden: true
            },
            {
                path: 'updateAdvertise',
                name: 'updateAdvertise',
                component: () => import('@/views/sms/advertise/update'),
                meta: { title: '编辑广告', perssion: ['sms'] },
                hidden: true
            }
        ]
    },
    {
        path: '/ums',
        component: Layout,
        redirect: '/ums/admin',
        name: 'ums',
        meta: { title: '权限', icon: 'safety-certificate', perssion: ['ums'] },
        children: [
            {
                path: 'admin',
                name: 'admin',
                component: () => import('@/views/ums/admin/index'),
                meta: { title: '用户列表', icon: "user", perssion: ['ums'] }
            },
            {
                path: 'role',
                name: 'role',
                component: () => import('@/views/ums/role/index'),
                meta: { title: '角色列表', icon: 'team', perssion: ['ums'] }
            },
            {
                path: 'allocMenu',
                name: 'allocMenu',
                component: () => import('@/views/ums/role/allocMenu'),
                meta: { title: '分配菜单', perssion: ['ums'] },
                hidden: true
            },
            {
                path: 'allocResource',
                name: 'allocResource',
                component: () => import('@/views/ums/role/allocResource'),
                meta: { title: '分配资源', perssion: ['ums'] },
                hidden: true
            },
            {
                path: 'menu',
                name: 'menu',
                component: () => import('@/views/ums/menu/index'),
                meta: { title: '菜单列表', icon: 'menu', perssion: ['ums'] }
            },
            {
                path: 'addMenu',
                name: 'addMenu',
                component: () => import('@/views/ums/menu/add'),
                meta: { title: '添加菜单', perssion: ['ums'] },
                hidden: true
            },
            {
                path: 'updateMenu',
                name: 'updateMenu',
                component: () => import('@/views/ums/menu/update'),
                meta: { title: '修改菜单', perssion: ['ums'] },
                hidden: true
            },
            {
                path: 'resource',
                name: 'resource',
                component: () => import('@/views/ums/resource/index'),
                meta: { title: '资源列表', icon: 'solution', perssion: ['ums'] }
            },
            {
                path: 'resourceCategory',
                name: 'resourceCategory',
                component: () => import('@/views/ums/resource/categoryList'),
                meta: { title: '资源分类', perssion: ['ums'] },
                hidden: true
            }
        ]
    },
    { path: '*', redirect: '/404', hidden: true }
]