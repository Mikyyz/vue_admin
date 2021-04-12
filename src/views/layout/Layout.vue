<template>
  <a-layout class="layout" theme="light">
    <sidebar :collapsed="collapsed" :menus="menus"/>
    <a-layout>
     <navbar :collapsed="collapsed" @toggle="toggle" />
     <!-- 打开的菜单tab -->
     <!-- <a-tabs class="tab-layout-tabs" style="height:52px" type="editable-card" :hide-add="true">
        <a-tab-pan slot="title"><span></span></a-tab-pan>
     </a-tabs> -->
     <app-main />
    </a-layout>
  </a-layout>
</template>
<script>
import { Navbar, Sidebar, AppMain } from './components'
export default {
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  data() {
    return {
      collapsed: false,
      menus: [],
      mode: 'inline',
      pageList: [],//存放已打开的页面
    };
  },
  methods: {
    toggle() {
      this.collapsed = !this.collapsed;
    }
  }
};
</script>
<style lang="less" scoped>
.layout {
  height: 100%;
}
</style>