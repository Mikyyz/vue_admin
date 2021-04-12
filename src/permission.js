import router from './router';
import store from './store';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// Progress 进度条样式
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'; //设置title的工具函数
import { getToken } from '@/utils/auth'; // 验权

const whiteList = ['/login']; //不重定向的白名单
NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async (to, from, next) => {
    // 请求路由时进度条开始
    NProgress.start()
    // 设置标题
    to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`));
    // 这里的getToken()就是在上面导入的auth.js里的getToken()方法
    const hasToken = getToken()
    //如果存在token，即存在已登陆的令牌
    if (hasToken) {
        //如果用户存在令牌的情况请求登录页面，就让用户直接跳转到首页，避免存在重复登录的情况
        if (to.path === '/login') {
            console.info('login')
            // 直接跳转到首页，当然取决于你的路由重定向到哪里
            next({ path: '/' })
            //一定要关闭进度条
            NProgress.done()
        } else {
            if (store.getters.roles.length === 0) {
                console.info('GetInfo')
                try {
                    // 如果有令牌，但是没有用户信息，证明用户是第一次登录，通过Vuex设置用户信息
                    const res = await store.dispatch('GetInfo')
                    const { username, menus } = res.data.data;
                    //生成可访问的路由表
                    await store.dispatch('GenerateRoutes', { menus, username });
                    //动态添加可访问的路由
                    router.addRoutes(store.getters.addRouters)
                    //设置好了之后，依然可以请求哪就跳转哪
                    next({ ...to, replace: true })
                } catch (error) {
                    // // 如果出错了，把令牌去掉，并让用户重新去到登录页面
                    notification.error({
                        message: '错误',
                        description: '请求用户信息失败，请重试'
                    })
                    store.dispatch('Logout').then(() => {
                        next({ path: '/' })
                        //关闭进度条
                        NProgress.done()
                    })
                }
            } else {
                console.info('next')
                next();
            }
        }
    } else {
        console.info('whiteList')
        //这里是没有令牌的情况
        //还记得上面的白名单吗，现在起作用了
        //whiteList.indexOf(to.path) !== -1)判断用户请求的路由是否在白名单里
        if (whiteList.indexOf(to.path) !== -1) {
            // 不是-1就证明存在白名单里，不管你有没有令牌，都直接去到白名单路由对应的页面
            next()
        } else {
            // 如果这个页面不在白名单里，直接跳转到登录页面
            next('/login')
            //关闭进度条
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    //每次请求结束后都需要关闭进度条
    NProgress.done()
})