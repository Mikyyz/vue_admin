<template>
    <a-config-provider :locale="zh_CN">
      <div id="app">
        <router-view :key="$route.path" />
      </div>
    </a-config-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
export default {
  name: 'App',
  components: {

  },
  data() {
    return {
      url: '',
      zh_CN
    }
  },
  mounted () {
    
  },
}
</script>

<style>
#app {
  height: 100%;
}
</style>
