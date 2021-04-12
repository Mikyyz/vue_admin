<template>
    <a-card class="product-wrapper" >
        <a-steps :current="current">
            <a-step v-for="step in steps" :key="step.id" :title="step.title" />
        </a-steps>
        <div class="product-detail" style="marginTop: 30px">
            <product-info-detail 
                v-show="this.current === 0"
                v-model="productParam"
                @nextStep="nextStep"
            />
            <product-sale-detail 
                v-show="this.current === 1"
                v-model="productParam"
                @nextStep="nextStep"
                @prevStep="prevStep"
            />
            <product-attr-detail 
                v-show="this.current === 2"
                v-model="productParam"
                @nextStep="nextStep"
                @prevStep="prevStep"
            />
            <product-relation-detail 
                v-show="this.current === 3"
                v-model="productParam"
                @nextStep="nextStep"
                @finishCommit="finishCommit"
            />
        </div>
    </a-card>
</template>

<script>
import { getProductInfo } from '@/api/product'
import ProductInfoDetail from './ProductInfoDetail';
import ProductSaleDetail from './ProductSaleDetail';
import ProductAttrDetail from './ProductAttrDetail';
import ProductRelationDetail from './ProductRelationDetail';
const defaultProductParam = {
    albumPics: '',
    brandId: undefined,
    brandName: '',
    deleteStatus: 0,
    description: '',
    detailDesc: '',
    detailHtml: '',
    detailMobileHtml: '',
    detailTitle: '',
    feightTemplateId: 0,
    flashPromotionCount: 0,
    flashPromotionId: 0,
    flashPromotionPrice: 0,
    flashPromotionSort: 0,
    giftPoint: 0,
    giftGrowth: 0,
    keywords: '',
    lowStock: 0,
    name: '',
    newStatus: 0,
    note: '',
    originalPrice: 0,
    pic: '',
    //会员价格{memberLevelId: 0,memberPrice: 0,memberLevelName: null}
    memberPriceList: [],
    //商品满减
    productFullReductionList: [{fullPrice: 0, reducePrice: 0}],
    //商品阶梯价格
    productLadderList: [{count: 0,discount: 0,price: 0}],
    previewStatus: 0,
    price: 0,
    productAttributeCategoryId: undefined,
    //商品属性相关{productAttributeId: 0, value: ''}
    productAttributeValueList: [],
    //商品sku库存信息{lowStock: 0, pic: '', price: 0, sale: 0, skuCode: '', spData: '', stock: 0}
    skuStockList: [],
    //商品相关专题{subjectId: 0}
    subjectProductRelationList: [],
    //商品相关优选{prefrenceAreaId: 0}
    prefrenceAreaProductRelationList: [],
    productCategoryId: undefined,
    productCategoryName: '',
    productSn: '',
    promotionEndTime: '',
    promotionPerLimit: 0,
    promotionPrice: undefined,
    promotionStartTime: '',
    promotionType: 0,
    publishStatus: 0,
    recommandStatus: 0,
    sale: 0,
    serviceIds: '',
    sort: 0,
    stock: 0,
    subTitle: '',
    unit: '',
    usePointLimit: 0,
    verifyStatus: 0,
    weight: 0
}
const steps = [
    {id: 1, title: '填写商品信息'},
    {id: 2, title: '填写商品促销'},
    {id: 3, title: '填写商品属性'},
    {id: 4, title: '选择商品关联'}
]
    export default {
        data() {
            return {
                current: 0,
                steps: steps,
                productParam: Object.assign({}, defaultProductParam)
            }
        },
        props: {
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        async created() {
            if(this.isEdit) {
                const res = await getProductInfo(this.$route.query.id);
                this.productParam = res.data;
                console.log(this.productParam)
            }
        },
        components: {
            ProductInfoDetail,
            ProductSaleDetail,
            ProductAttrDetail,
            ProductRelationDetail
        },
        methods: {
            nextStep() {
                if(this.current < this.steps.length - 1) {
                    this.current++;
                }
            },
            prevStep(){
                if(this.current > 0) {
                    this.current--;
                }
            },
            //处理完成
            finishCommit(){}
        },
    }
</script>

<style lang="less" scoped>
.product-wrapper {
    width: 1000px;
    margin: 0 auto;
}
</style>