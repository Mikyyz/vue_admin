<template>
    <a-popover trigger="click" placement="bottomRight" class="action">
      <template slot="content">
          <div>
            <a-tabs :defaultActiveKey="defaultActiveKey">
                <a-tab-pane key="tab1" :tab="`通知(${msgCount})`"></a-tab-pane>
                <a-tab-pane key="tab2" :tab="`系统消息(${msgCount})`" force-render></a-tab-pane>
            </a-tabs>
            <div style="margin-top: 5px;text-align: center">
                <a-button @click="toMyAnnouncement()" type="dashed" block>查看更多</a-button>
            </div>
        </div>
      </template>
      <span class="header-notice">
      <a-badge  dot >
        <a-icon type="bell" style="font-size: 17px"/>
      </a-badge>
    </span>
    </a-popover>
</template>

<script>
    export default {
        data() {
            return {
                msgTotal: 10,
                msgCount: 12,
                defaultActiveKey: 'tab1'
            }
        },
        methods: {
            toMyAnnouncement() {
                console.log('查看')
            }
        },
    }
</script>

<style lang="less" scoped>

</style>