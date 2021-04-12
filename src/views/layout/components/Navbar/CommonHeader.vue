<template>
     <a-layout-header style="background: #fff; padding: 0">
        <div class="header">
            <!-- <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="toggle"
            /> -->
            <user-menu />
        </div>
      </a-layout-header>
</template>

<script>
import UserMenu from './UserMenu'
    export default {
        data() {
            return {
                
            }
        },
        components: {
            UserMenu
        },
        methods: {
            toggle() {
                this.$emit('toggle')
            }
        },
        props: {
            collapsed: {
                type: Boolean,
                required: true
            },
        },
    }
</script>

<style lang="less" scoped>
@height: 59px;
.header {
    color: white;
    font-size:  15px;
    background-color: @primary-color;
    height: @height;
    transition: background 300ms;
    display: flex;
    align-items: center;
    &.dark {
        color: #000;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
        background-color: white !important;
    }
}
.ant-layout-header {
    height: @height;
    line-height: @height;
}
.trigger {
    margin:0 20px;
    font-size: 24px;
}
.action:hover {
    color: #f1f1f1;
}
</style>