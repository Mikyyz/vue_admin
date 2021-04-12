<template>
    <a-form-model 
        class="product-attr-detail"
        :model="value"
        ref="productAttrForm"
        :label-col="labelCol" 
        :wrapper-col="wrapperCol"
    >
        <a-form-model-item label="属性类型" prop="productAttr" v-bind="formItemLayout" colon>
            <a-select 
                v-model="value.productAttributeCategoryId"
                placeholder="请选择属性类型"
                @change="handleProductAttrChange"
            >
                <a-select-option 
                    v-for="option in productAttributeCategoryOptions" 
                    :key="option.value" 
                    :value="option.value"
                >
                    {{option.label}}
                </a-select-option>
            </a-select>
        </a-form-model-item>
        <a-form-model-item label="商品规格"  colon>
            <a-card class="cardBg" style="min-height: 45px">
                <div v-for="(productAttr, index) in selectProductAttr" :key="index">
                    <div>{{productAttr.name}}:</div>
                    <a-checkbox-group style="margin: 10px 0" v-if="productAttr.handAddStatus === 0" v-model="selectProductAttr[index].values">
                        <a-checkbox v-for="item in getInputListArr(productAttr.inputList)" :key="item" :value="item">{{item}}</a-checkbox>
                    </a-checkbox-group>
                    <div v-else>
                        <div v-if="selectProductAttr[index].options.length > 0">
                            <a-checkbox-group 
                                v-model="selectProductAttr[index].values" 
                            >
                                <a-checkbox 
                                    v-for="(item, index1) in selectProductAttr[index].options" 
                                    :key="index1"
                                    :value="item"
                                >
                                    {{item}}
                                    <a-button type="link" @click="handleRemoveProductAttrValue(index, index1)">删除</a-button>
                                </a-checkbox>
                            </a-checkbox-group>
                        </div>
                        <div style="margin: 10px 0">
                            <a-input v-model.trim="addProductAttrValue" style="width: 160px;margin-right: 10px" allowClear/>
                            <a-button @click="handleAddProductAttrValue(index)">增加</a-button>
                        </div>
                    </div>
                </div>
            </a-card>
            <a-table 
                style="margin: 20px 0"
                bordered
                :columns="columns"
                :data-source="data"
            />
            <a-button type="primary" @click="handleRefreshProductSkuList">刷新列表</a-button>
            <a-button type="primary" style="margin: 0 20px" @click="handleSyncProductSkuPrice">同步价格</a-button>
            <a-button type="primary" @click="handleSyncProductSkuStock">同步库存</a-button>
        </a-form-model-item>
        <a-form-model-item label="属性图片" colon v-if="hasAttrPic">
            <a-card>
                <div v-for="(item, index) in selectProductAttrPics" :key="index">
                    <span>{{item.name}}</span>
                </div>
            </a-card>
        </a-form-model-item>
        <a-form-model-item label="商品参数" colon>
            <a-card style="min-height: 45px" class="cardBg">
                <div v-for="(item, index) in selectProductParam" :key="index">
                    <a-space direction="vertical">
                        <div>{{item.name}}:</div>
                        <a-select v-if="item.inputType===1" v-model="selectProductParam[index].value" :placeholder="`请选择${item.name}`" style="width: 250px">
                            <a-select-option 
                                v-for="(item, index) in getParamInputList(item.inputList)"
                                :key="index"
                            >
                                {{item}}
                            </a-select-option>
                        </a-select>
                        <a-input style="width: 250px" v-else v-model="selectProductParam[index].value"/>
                    </a-space>
                </div>
            </a-card>
        </a-form-model-item>
        <a-form-model-item label="商品图片" colon>
            <multi-upload v-model="selectProductPics"/>
        </a-form-model-item>
        <a-form-model-item style="margin-left: 200px">
            <a-button  @click="handlePrev">上一步，填写商品促销</a-button>
            <a-button type="primary" style="margin-left: 20px"  @click="handleNext">下一步，选择商品关联</a-button>
      </a-form-model-item>
    </a-form-model>
</template>

<script>
import { getproductAttributeList,getProductAttributeById } from '@/api/product'
import multiUpload from '@/components/Upload/multiUpload'
const columns = [
    {
        title: '颜色',
        key: "颜色",
        align: 'center',
        width: '65px'
    },
    {
        title: '尺寸',
        key: '尺寸',
        align: 'center',
        width: '65px'
    },
    {
        title: '销售价格',
        key: '销售价格',
        align: 'center'
    },
    {
        title: '商品库存',
        key: '商品库存',
        align: 'center'
    },
    {
        title: '库存预警值',
        key: '库存预警值',
        align: 'center'
    },
    {
        title: 'SKU编号',
        key: 'SKU编号',
        align: 'center'
    },
    {
        title: '操作',
        key: '操作',
        align: 'center'
    }
]
    export default {
  components: { multiUpload },
        data() {
            return {
                //商品属性分类下拉选项
                productAttributeCategoryOptions: [],
                // 表单样式
                labelCol: {
                    xs: { span: 4 },
                    sm: { span: 5 },
                },
                wrapperCol: {
                    xs: { span: 8 },
                    sm: { span: 16 },
                },
                formItemLayout: {
                    wrapperCol: { span: 8 },
                },
                //选中的商品属性
                selectProductAttr: [],
                //选中的商品参数
                selectProductParam: [],
                //可手动添加的商品属性
                addProductAttrValue: '',
                //表格数据
                columns: columns,
                data: [],
                //选中的商品属性图片
                selectProductAttrPics: []
            }
        },
        props: {
            value: {
                type: Object
            }
        },
        created() {
            this.getProductAttrCateList();
        },
        computed: {
            hasAttrPic() {
                return this.selectProductAttrPics.length < 1 ? false : true
            },
            //商品的主图和画册图片
            selectProductPics:{
                get:function () {
                let pics=[];
                if(this.value.pic===undefined||this.value.pic==null||this.value.pic===''){
                    return pics;
                }
                pics.push(this.value.pic);
                if(this.value.albumPics===undefined||this.value.albumPics==null||this.value.albumPics===''){
                    return pics;
                }
                let albumPics = this.value.albumPics.split(',');
                for(let i=0;i<albumPics.length;i++){
                    pics.push(albumPics[i]);
                }
                return pics;
                },
                set:function (newValue) {
                if (newValue == null || newValue.length === 0) {
                    this.value.pic = null;
                    this.value.albumPics = null;
                } else {
                    this.value.pic = newValue[0];
                    this.value.albumPics = '';
                    if (newValue.length > 1) {
                    for (let i = 1; i < newValue.length; i++) {
                        this.value.albumPics += newValue[i];
                        if (i !== newValue.length - 1) {
                        this.value.albumPics += ',';
                        }
                    }
                    }
                }
                }
            }
        },
        methods: {
            //请求属性列表
            async getProductAttrCateList() {
                let params = {pageNum: 1, pageSize: 100};
                const res = await getproductAttributeList(params);
                const { list } = res.data.data;
                for(let item of list) {
                    this.productAttributeCategoryOptions.push({label: item.name, value: item.id})
                }
            },
            //根据cid获取商品属性
            async getProductAttrList(type, cid) {
                this.selectProductAttr = []
                this.selectProductParam = []
                let params = {pageNum: 1, pageSize: 100, type: type};
                const res = await getProductAttributeById(cid, params);
                const { list } = res.data.data;
                if(type === 0) {
                    for(let [item, index] of new Map(list.map((i, item) => [i, item]))) {
                        let options = [];
                        let values = [];
                        if(item.handAddStatus === 1){
                                //获取手动添加编辑属性
                                options = this.getEditAttrOptions(item.id);
                            }
                             //获取选中属性
                            values = this.getEditAttrValues(index);
                            this.selectProductAttr.push({
                                id: item.id,
                                name: item.name,
                                handAddStatus: item.handAddStatus,
                                inputList: item.inputList,
                                values: values,
                                options: options
                            })
                            console.log(this.selectProductAttr)
                    }
                } else {
                    for(let item of list) {
                        let value = null;
                        value = this.getEditParamValue(item.id);
                        this.selectProductParam.push({
                            id: item.id,
                            name: item.name,
                            value: value,
                            inputType: item.inputType,
                            inputList: item.inputList
                        });
                    }
                }
            },
            //获取参数列表数组
            getParamInputList(inputList) {
                return inputList.split(',')
            },
            // 选择属性后
            handleProductAttrChange(value) {
                this.getProductAttrList(0, value);
                this.getProductAttrList(1, value)
            },
            //获取设置的可手动添加属性值
            getEditAttrOptions(id) {
                let options = [];
                for(let item of this.value.productAttributeValueList) {
                    if(item.productAttributeId === id) {
                        options = item.value.split(',');
                    }
                }
                return options;
            },
            //获取选中的属性值
            getEditAttrValues(index) {
                let values = new Set();
                if (index === 0) {
                for (let i = 0; i < this.value.skuStockList.length; i++) {
                    let sku = this.value.skuStockList[i];
                    let spData = JSON.parse(sku.spData);
                    if (spData!= null && spData.length>=1) {
                    values.add(spData[0].value);
                    }
                }
                } else if (index === 1) {
                for (let i = 0; i < this.value.skuStockList.length; i++) {
                    let sku = this.value.skuStockList[i];
                    let spData = JSON.parse(sku.spData);
                    if (spData!= null && spData.length>=2) {
                    values.add(spData[1].value);
                    }
                }
                } else {
                for (let i = 0; i < this.value.skuStockList.length; i++) {
                    let sku = this.value.skuStockList[i];
                    let spData = JSON.parse(sku.spData);
                    if (spData!= null && spData.length>=3) {
                    values.add(spData[2].value);
                    }
                }
                }
                return Array.from(values);
            },
            //获取属性的值
            getEditParamValue(id) {
                for(let item of this.value.productAttributeValueList) {
                    if(item.productAttributeId === id) {
                        return item.value;
                    }
                }
            },
            getInputListArr(inputList) {
                return inputList.split(',');
            },
            //增加商品属性值
            handleAddProductAttrValue(index){
                console.log(this.selectProductAttr)
                let options = this.selectProductAttr[index].options;
                if(this.addProductAttrValue == '') {
                    this.$message.warning('属性值不能为空');
                    return;
                }
                if(options.indexOf(this.addProductAttrValue) !== -1) {
                    this.$message.warning('属性值不能重复');
                    return;
                }
                this.selectProductAttr[index].options.push(this.addProductAttrValue);
                this.addProductAttrValue = '';
            },
            //删除输入的商品属性
            handleRemoveProductAttrValue(index, index1) {
                this.selectProductAttr[index].options.splice(index1, 1)
            },
            //刷新列表按钮
            handleRefreshProductSkuList(){
                this.$confirm({
                    title: '提示',
                    content: '刷新列表将导致sku信息重新生成，是否要刷新',
                    onOk(){},
                    onCancel(){}
                })
            },
            //同步价格按钮
            handleSyncProductSkuPrice() {
                this.$confirm({
                    title: '提示',
                    content: '将同步第一个sku的价格到所有sku,是否继续',
                    onOk(){},
                    onCancel(){}
                })
            },
            //同步库存按钮
            handleSyncProductSkuStock(){
                this.$confirm({
                    title: '提示',
                    content: '将同步第一个sku的库存到所有sku,是否继续',
                    onOk(){},
                    onCancel(){}
                })
            },
            //上一步
            handlePrev(){
                this.$emit('prevStep')
            },
            //下一步
            handleNext(){
                this.$emit('nextStep')
            }
        },
    }
</script>

<style lang="less" scoped>
.cardBg {
    background: #F8F9FC;
}
</style>