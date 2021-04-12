<template>
    <a-card class="order-setting">
        <a-form-model 
            :model="orderSetting" 
            ref="orderSettingForm"
            :rules="rules"
        >
            <a-form-model-item label="秒杀订单超过" prop="flashOrderOvertime"  colon v-bind="formItemStyle">
                <a-input 
                    v-model.number="orderSetting.flashOrderOvertime" 
                    prop="flashOrderOvertime" 
                    addon-after="分"
                    size="large"
                    style="disply: inline-block"
                />
                <div class="content">未付款，订单自动关闭</div>
            </a-form-model-item>
            <a-form-model-item label="正常订单超过" prop="normalOrderOvertime"  colon v-bind="formItemStyle">
                <a-input 
                    v-model.number="orderSetting.normalOrderOvertime" 
                    prop="normalOrderOvertime" 
                    addon-after="分"
                    size="large"
                />
                <div class="content">未付款，订单自动关闭</div>
            </a-form-model-item>
            <a-form-model-item label="发货超过" prop="confirmOvertime"  colon v-bind="formItemStyle">
                <a-input 
                    v-model.number="orderSetting.confirmOvertime" 
                    prop="flashOrderOvertime" 
                    addon-after="分"
                    size="large"
                />
                <div class="content">未收货，订单自动完成</div>
            </a-form-model-item>
            <a-form-model-item label="订单完成超过" prop="finishOvertime"  colon v-bind="formItemStyle">
                <a-input 
                    v-model.number="orderSetting.finishOvertime" 
                    prop="finishOvertime" 
                    addon-after="天"
                    size="large"
                />
                <span>自动结束交易，不能申请售后</span>
            </a-form-model-item>
            <a-form-model-item label="订单完成超过" prop="commentOvertime"  colon v-bind="formItemStyle">
                <a-input 
                    v-model.number="orderSetting.commentOvertime" 
                    prop="finishOvertime" 
                    addon-after="天"
                    size="large"
                />
                <div class="content">自动五星好评</div>
            </a-form-model-item>
            <a-form-model-item style="margin-left: 482px">
                <a-button type="primary" @click="updateOederSetting">提交</a-button>
            </a-form-model-item>
        </a-form-model>
    </a-card>
</template>

<script>
import { getOrderSetting, updateOrderSetting } from '@/api/order'
//初始订单设置参数
const defaultOrderSetting = {
    id: null,
    flashOrderOvertime: 0,
    normalOrderOvertime: 0,
    confirmOvertime: 0,
    finishOvertime: 0,
    commentOvertime: 0
}
//自定义校验
let checkTime = (rule, value, callback) => {
    if(value === '') {
        return callback(new Error('此字段值不能为空'))
    } 
    let intValue = parseInt(value);
    if (!Number.isInteger(intValue)) {
      return callback(new Error('请输入数字值'));
    }
    callback();
}
    export default {
        data() {
            return {
                orderSetting: Object.assign({}, defaultOrderSetting),
                formItemStyle: {
                    labelCol:{span: 8},
                    wrapperCol: {span: 6}
                },
                rules: {
                    flashOrderOvertime: [{validator: checkTime, trigger: 'blur'}],
                    normalOrderOvertime: [{validator: checkTime, trigger: 'blur'}],
                    confirmOvertime: [{validator: checkTime, trigger: 'blur'}],
                    finishOvertime: [{validator: checkTime, trigger: 'blur'}],
                    commentOvertime: [{validator: checkTime, trigger: 'blur'}]
                }
            }
        },
        created() {
            this.getOrderSettings();
        },
        methods: {
            async getOrderSettings() {
                const res = await getOrderSetting(1);
                this.orderSetting = res.data.data;
            },
            //提交更新
            updateOederSetting() {
                const _self = this;
                this.$refs.orderSettingForm.validate(valid => {
                    if(valid) {
                        this.$confirm({
                            title: '提示',
                            content: '是否要提交修改',
                            onOk(){
                                updateOrderSetting(1, _self.orderSetting).then(res => {
                                    _self.$message.success(res.message)
                                }).catch(error => {
                                    _self.$message.error(error.message)
                                })
                            },
                            onCancel(){}
                        })
                    }
                })
            }
        },
    }
</script>

<style lang="less" scoped>
.order-setting {
    margin: 10px;
    .content {
        width: 240px; 
        margin-left: 10px
    }
}
</style>