<template>
    <a-result status="404" title="404" sub-title="抱歉,该页面不存在">
    <template #extra>
      <a-button type="primary" @click="backHome">
        返回首页
      </a-button>
    </template>
  </a-result>
</template>

<script>
    export default {
        methods: {
            backHome() {
                this.$router.push({path: '/home'})
            }
        },
    }
</script>

<style lang="less" scoped>

</style>