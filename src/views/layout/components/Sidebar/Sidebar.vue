<template>
    <a-layout-sider width="208px"  :collapsed="collapsed" :trigger="null" collapsible style="background: #fff">
        <h1 class="title">后台管理系统</h1>
        <side-item :routes="routes" />
    </a-layout-sider>
</template>

<script>
import { mapGetters } from 'vuex';
import SideItem from './SideItem'
    export default {
        data() {
            return {
                menus: []
            }
        },
        components: {
            SideItem
        },
        props: {
            theme: {
                type: String,
                required: false,
                default: 'light'
            },
            collapsed: {
                type: Boolean,
                required: false,
                default: false
            },
            collapsible: {
                type: Boolean,
                required: false,
                default: false
            },
            mode: {
                type: String,
                default: 'inline'
            }
        },
        computed: {
          ...mapGetters(['routers', 'users']),
            smenuStyle() {
                let style = { 'padding': '0' }
                 style['height'] = 'calc(100% - 59px)'
                 style['marginTop'] = '-10px';
                return style
            },
            routes() {
                return this.routers;
            }
        },
    }
</script>

<style lang="less">
@height: 59px;
.title {
    font-size: 18px;
    height: @height;
    line-height: @height;
    background-color: @primary-color;
    color: white;
    text-align: center;
}
.ant-menu.ant-menu-root {
    & > .ant-menu-item:first-child {
      background-color: transparent;

      & > a, & > a:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &.ant-menu-item-selected {
        & > a, & > a:hover {
          color: @primary-color;
        }
      }
    }

    &.ant-menu-dark > .ant-menu-item:first-child {
      & > a, & > a:hover {
        color: rgba(255, 255, 255, 0.65);
      }

      &.ant-menu-item-selected {
        & > a, & > a:hover {
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
</style>