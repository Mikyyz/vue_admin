<template>
    <a-form-model 
        class="product-sale-detail" 
        :model="value" 
        ref="productSaleForm"
        :label-col="labelCol" 
        :wrapper-col="wrapperCol"
    >
        <a-form-model-item label="赠送积分" colon>
            <a-input v-model="value.giftPoint"/>
        </a-form-model-item>
        <a-form-model-item label="赠送成长值" colon>
            <a-input v-model="value.giftGrowth"/>
        </a-form-model-item>
        <a-form-model-item label="积分购买限制" colon>
            <a-input v-model="value.usePointLimit"/>
        </a-form-model-item>
        <a-form-model-item label="积分购买限制" colon>
            <a-switch v-model="previewStatus" />
        </a-form-model-item>
        <a-form-model-item label="商品上架" colon>
            <a-switch v-model="publishStatus" />
        </a-form-model-item>
        <a-form-model-item label="商品推荐" colon>
            <span style="margin-right: 10px">新品</span>
            <a-switch v-model="newStatus" />
            <span style="margin-left: 10px;margin-right: 10px">推荐</span>
            <a-switch v-model="recommandStatus"/>
        </a-form-model-item>
        <a-form-model-item label="服务保证" colon>
            <a-checkbox-group v-model="selectServiceList">
                <a-checkbox :value="1">无忧退货</a-checkbox>
                <a-checkbox :value="2">快速退款</a-checkbox>
                <a-checkbox :value="3">免费包邮</a-checkbox>
            </a-checkbox-group>
        </a-form-model-item>
        <a-form-model-item label="详细页标题" colon>
            <a-input v-model="value.detailTitle"/>
        </a-form-model-item>
        <a-form-model-item label="详细页描述" colon>
            <a-input v-model="value.detailDesc"/>
        </a-form-model-item>
        <a-form-model-item label="商品关键字" colon>
            <a-input v-model="value.keywords"/>
        </a-form-model-item>
        <a-form-model-item label="商品备注" colon>
            <a-input v-model="value.note" type="textarea" :autoSize="true"/>
        </a-form-model-item>
        <a-form-model-item label="选择优惠方式" colon>
            <a-radio-group v-model="value.promotionType" button-style="solid">
                <a-radio-button :value="0">无优惠</a-radio-button>
                <a-radio-button :value="1">特惠促销</a-radio-button>
                <a-radio-button :value="2">会员价格</a-radio-button>
                <a-radio-button :value="3">阶梯价格</a-radio-button>
                <a-radio-button :value="4">满减价格</a-radio-button>
            </a-radio-group>
        </a-form-model-item>
        <a-form-model-item v-show="value.promotionType===1" style="margin-left: 205px">
            <div>
                开始时间：
                <a-date-picker 
                    v-model="value.promotionStartTime"
                    :disabled-date="disabledStartDate"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择开始时间"
                    :locale="locale"
                />
            </div>
            <div>
                结束时间：
                <a-date-picker 
                    v-model="value.promotionEndTime"
                    :disabled-date="disabledEndDate"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择结束时间"
                    :locale="locale"
                />
            </div>    
            <div class="littleMargin">
                促销价格：
                <a-input style="width: 220px" v-model="value.promotionPrice" placeholder="输入促销价格" />
            </div>
        </a-form-model-item>
        <a-form-model-item v-show="value.promotionType === 2" style="margin-left: 205px">
            <div v-for="item in value.memberPriceList" :key="item.id">
                {{item.memberLevelName}}:
                <a-input v-model="item.memberPrice" style="width: 200px"/>
            </div>
        </a-form-model-item>
        <a-form-model-item v-show="value.promotionType === 3" style="margin-left: 205px">
            <a-table :columns="productLadderColumns" bordered align="center" :pagination="false" :data-source="productLadderListData">
                 <template slot="mount" slot-scope="mount">
                    <a-input v-model="mount.count"/>
                </template>
                <template slot="discount" slot-scope="discount">
                    <a-input v-model="discount.discount"/>
                </template>
                <template slot="action" slot-scope="action">
                    <a-button type="link" @click="handleRemoveProductLadder(action)">删除</a-button>
                    <a-button type="link" @click="handleAddProductLadder(action)">添加</a-button>
                </template>
            </a-table>
        </a-form-model-item>
        <a-form-model-item v-show="value.promotionType === 4" style="margin-left: 205px">
            <a-table :columns="fullReductionColumns" bordered align="center" :pagination="false" :data-source="productFullReductionListData">
                 <template slot="full" slot-scope="full">
                    <a-input v-model="full.fullPrice"/>
                </template>
                <template slot="reduce" slot-scope="reduce">
                    <a-input v-model="reduce.reducePrice"/>
                </template>
                <template slot="action" slot-scope="action">
                    <a-button type="link" @click="handleRemoveFullReduction(action)">删除</a-button>
                    <a-button type="link" @click="handleAddFullReduction(action)">添加</a-button>
                </template>
            </a-table>
        </a-form-model-item>
        <a-form-model-item style="margin-left: 200px">
            <a-button  @click="handlePrev">上一步，填写商品信息</a-button>
            <a-button style="margin-left: 20px" type="primary" @click="handleNext">下一步，填写商品属性</a-button>
      </a-form-model-item>
    </a-form-model>
</template>

<script>
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { getMemberLevel } from '@/api/member';
const productLadderColumns = [
    {
        title: '数量',
        width: '120px',
        align: 'center',
        key: 'mount',
        scopedSlots: { customRender: 'mount' },
    },
    {
        title: '折扣',
        width: '120px',
        align: 'center',
        key: 'discount',
        scopedSlots: { customRender: 'discount' },
    },
    {
        title: '操作',
        align: 'center',
        scopedSlots: { customRender: 'action' },
        width: '200px',
        key: 'action'
    }
]
const fullReductionColumns = [
    {
        title: '满',
        width: '120px',
        align: 'center',
        key: 'full',
        scopedSlots: { customRender: 'full' },
    },
    {
        title: '立减',
        width: '120px',
        align: 'center',
        key: 'reduce',
        scopedSlots: { customRender: 'reduce' },
    },
    {
        title: '操作',
        align: 'center',
        scopedSlots: { customRender: 'action' },
        width: '200px',
        key: 'action'
    }
]
    export default {
        data() {
            return {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 5 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 12 },
                },
                locale,
                key: 1,
                selectServiceList: [],
                productLadderColumns: productLadderColumns,
                fullReductionColumns: fullReductionColumns,
                previewStatus: !!this.value.previewStatus,
                publishStatus: !!this.value.publishStatus,
                newStatus: !!this.value.newStatus,
                recommandStatus: !!this.value.recommandStatus,
                productLadderListData: [Object.assign({key: 1}, ...this.value.productLadderList)],
                productFullReductionListData: [Object.assign({key: 1}, ...this.value.productFullReductionList)]
            }
        },
        props: {
            value: Object
        },
        created() {
            getMemberLevel({defaultStatus: 0}).then(res => {
                let memberPriceList = [];
                const memberPriceListArr = res.data.data;
                for(let item of memberPriceListArr){
                    memberPriceList.push({memberLevelId: item.id, memberLevelName: item.name})
                }
                this.value.memberPriceList = memberPriceList;
            })
        },
        methods: {
           disabledStartDate(startValue) {
               const endValue = this.value.promotionEndTime;
               if (!startValue || !endValue) {
                    return false;
               }
                return startValue.valueOf() > endValue.valueOf();
           },
           disabledEndDate(endValue) {
               const startValue = this.value.promotionStartTime;
               if (!endValue || !startValue) {
                    return false;
                }
                return startValue.valueOf() >= endValue.valueOf();
           },
           handleRemoveProductLadder(row) {
               let productLadderList = this.productLadderListData;
               if(productLadderList.length === 1) {
                   console.log(productLadderList)
                   return;
               } else {
                   productLadderList.splice(row.key, 1)
               }
           },
           handleAddProductLadder(row) {
               console.log(row);
               let productLadderList = this.productLadderListData;
               if(productLadderList.length < 3) {
                   productLadderList.unshift({
                        count: 0,
                        discount: 0,
                        price: 0,
                        key: ++this.key
                    })
               } else {
                   this.$message.warning('最多只能添加三条数据')
               }
           },
           handleRemoveFullReduction(row) {
               let productFullReductionList = this.productFullReductionListData;
               if(productFullReductionList.length === 1) {
                   return;
               } else {
                   productFullReductionList.splice(row.key, 1)
               }
           },
           handleAddFullReduction(row) {
               console.log(row);
               let productFullReductionList = this.productFullReductionListData;
               if(productFullReductionList.length < 3) {
                   productFullReductionList.unshift({
                        fullPrice: 0,
                        reducePrice: 0,
                        key: ++this.key
                    })
               } else {
                   this.$message.warning('最多只能添加三条数据')
               }
           },
           handlePrev() {
               this.$emit('prevStep')
           },
           handleNext() {
                this.$emit('nextStep')
           }
        },
    }
</script>

<style lang="less" scoped>

</style>