import Vue from 'vue';
import Router from 'vue-router';
import { constantRouterMap } from '../config/router.config'


Vue.use(Router);

const routes = constantRouterMap;

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})


export default router;