<template>
    <a-modal :footer="null" title="订单跟踪"  :visible="visible" @cancel="handleCancel">
        <a-steps :current="defaultLogisticsList.length-1" direction="vertical">
            <a-step 
                v-for="item in defaultLogisticsList" 
                :key="item.title" 
                :title="item.title"
                :description="item.time"
            />
        </a-steps>
    </a-modal>
</template>

<script>
const defaultLogisticsList=[
    {title: '订单已提交，等待付款',time:'2020-04-01 12:00:00 '},
    {title: '订单付款成功',time:'2020-04-01 12:00:00 '},
    {title: '在北京市进行下级地点扫描，等待付款',time:'2020-04-01 12:00:00 '},
    {title: '在分拨中心广东深圳公司进行卸车扫描，等待付款',time:'2020-04-01 12:00:00 '},
    {title: '在广东深圳公司进行发出扫描',time:'2020-04-01 12:00:00 '},
    {title: '到达目的地网点广东深圳公司，快件将很快进行派送',time:'2020-04-01 12:00:00 '},
    {title: '订单已签收，期待再次为您服务',time:'2020-04-01 12:00:00 '}
];
    export default {
        name:'logisticsDialog',
        props: {
            value: Boolean            
        },
        computed: {
            visible: {
                get(){
                    return this.value
                },
                set(visible){
                    this.value = visible
                }
            }
        },
        data() {
            return {
                defaultLogisticsList: defaultLogisticsList
            }
        },
        methods: {
            handleCancel() {
                this.$emit('cancel')
            }
        },
    }
</script>

<style lang="less" scoped>

</style>