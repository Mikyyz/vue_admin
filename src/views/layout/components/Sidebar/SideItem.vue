<template>
    <a-menu 
        class="sidebar-item"
        :defaultSelectedKeys="[$route.path]"
        :defaultOpenKeys="openKeys"
        @openChange="onOpenChange"
        @click="menuClick"
        mode="inline"
    >
       <!-- 开始遍历菜单 -->
       <template v-for="item in routeList">
           <!-- 如果当前遍历项只有一个children,则无子菜单所有的key都是path用户路由跳转,以及当前选中记录 -->
           <a-menu-item  v-if="hasOneShowingChildren(item.children)" :key="'/'+item.children[0].path">
                <router-link :to="'/'+item.children[0].path">
                    <svg-icon :icon-class="item.children[0].meta.icon" />
                    <span class="span-title">{{item.children[0].meta.title}}</span>
                </router-link>
           </a-menu-item>
           <!-- 如果有子菜单,传入菜单信息并且运用下面定义的函数式组件 -->
           <a-sub-menu v-else :key="item.path">
                <template slot="title">
                    <svg-icon :icon-class="item.meta.icon" />
                    <span class="span-title">{{item.meta.title}}</span>
                </template>
                <template v-for="menuItem in item.children">
                    <a-menu-item :key="`${item.path}/${menuItem.path}`">
                        <router-link :to="`${item.path}/${menuItem.path}`">
                            <svg-icon :icon-class="menuItem.meta.icon" />
                            <span class="span-title">{{menuItem.meta.title}}</span>
                        </router-link>
                    </a-menu-item>
                </template>
            </a-sub-menu>
       </template>
    </a-menu>
</template>
<script>
import store from 'store';
  export default {
        name: 'SideItem',
        data() {
            return {
                openKeys: [],
                rootSubmenuKeys: ['/home', '/pms', '/oms', '/ums', '/sms'],
                defaultOpenKeys: [], //默认展开的节点
            }
        },
        props: {
            routes: {
                type: Array,
                reuqired: true
            },
        },    
        methods: {
            hasOneShowingChildren(children) {
                const showingChildren = children.filter(item => {
                    return !item.hidden
                })
                if(showingChildren.length === 1) {
                    return true;
                }
                return false
            },
            onOpenChange(openKeys) {
                //将当前打开的父级菜单存入缓存中
                store.set('systemOpenKeys', openKeys);
                const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
                if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                    this.openKeys = openKeys;
                } else {
                    this.openKeys = latestOpenKey ? [latestOpenKey] : []
                }
            },
            // 点击菜单，路由跳转,注意的是当点击MenuItem才会触发此函数
            menuClick({item, key, keyPath}) {
                console.log(item,key, keyPath)
                // 获取到当前的key,并且跳转
                this.$router.push({ path: key });
            }
        },
        computed: {
            routeList() {
                return this.routes.filter(item => !item.hidden);
            }
        },
        created() {
            // 将从缓存中取出openKeys
            const openKeys = store.get('systemOpenKeys');
            // 存在即取最后一项赋值
            if(openKeys) {
                this.openKeys = [openKeys.pop()];
            }
        }
    }
</script>

<style lang="less" scoped>
.span-title {
    margin-left: 10px;
}
</style>