<template>
    <div class="product-list">
        <a-card>
            <span slot="title">
                <a-icon type="search" />
                <span>筛选搜索</span>
            </span>
            <a-form-model class="ant-advanced-search-form" :model="listQuery" ref="form">
                <a-row :gutter="24">
                    <a-col :span="8">
                        <a-form-model-item label="输入搜索" prop="keyword">
                            <a-input placeholder="商品名称" v-model="listQuery.keyword"/>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="商品货号" prop="productSn">
                            <a-input placeholder="商品货号" v-model="listQuery.productSn"/>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="商品分类" prop="selectProductCateValue">
                            <a-cascader 
                                v-model="selectProductCateValue"
                                :options="productCateOptions" 
                                placeholder="请选择分类" 
                                @change="changeProductCategory" 
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="商品品牌" prop="brandId">
                            <a-select v-model="listQuery.brandId" allowClear placeholder="请选择品牌" style="width: 171px">
                                <a-select-option v-for="option in brandOptions" :vlaue="option.value" :key="option.value" >
                                    {{option.label}}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="上架状态" prop="publishStatus">
                            <a-select v-model="listQuery.publishStatus" allowClear placeholder="全部" style="width: 171px">
                                <a-select-option v-for="option in publishStatusOptions" :vlaue="option.label" :key="option.value" >
                                    {{option.label}}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="审核状态" prop="verifyStatus">
                            <a-select v-model="listQuery.verifyStatus" allowClear placeholder="全部" style="width: 171px">
                                <a-select-option v-for="option in verifyStatusOptions" :vlaue="option.label" :key="option.value" >
                                    {{option.label}}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="24" :style="{ textAlign: 'right' }">
                        <a-button style="marginRight: 20px" @click="handleResetSearch()">重置</a-button>
                        <a-button style="marginRight: 115px" type="primary" @click="handleSearchList()">查询结果</a-button>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-card>
        <a-card class="operate-container">
            <span slot="title">
                <a-icon type="file-text" theme="filled" />
                <span>列表数据</span>
            </span>
            <a-button slot="extra" @click="handleAddProduct()">添加</a-button>
        </a-card>
        <a-table 
            :columns="columns" 
            :data-source="productList" 
            bordered 
            align="center" 
            :row-selection="rowSelection"
            :loading="loading"
            :pagination="pagination"
        >
            <template slot="img" slot-scope="img">
                <img :src="img.pic" style="height: 80px" alt="">
            </template>
            <template slot="brand" slot-scope="brand">
                <p>{{brand.name}}</p>
                <p>品牌:{{brand.brandName}}</p>
            </template>
            <template slot="productSn" slot-scope="productSn">
                <p>价格:￥{{productSn.price}}</p>
                <p>货号:{{productSn.productSn}}</p>
            </template>
            <template slot="tags" slot-scope="tags">
                <p>
                    <span style="marginRight: 10px">上架:</span>
                    <a-switch v-model="tags.publishStatus"/>
                </p>
                <p>
                    <span style="marginRight: 10px">新品:</span>
                    <a-switch v-model="tags.newStatus"/>
                </p>
                <p>
                    <span style="marginRight: 10px">推荐:</span>
                    <a-switch v-model="tags.recommandStatus"/>
                </p>
            </template>
            <template slot="sku" slot-scope="sku">
                <a-button type="primary" shape="circle" icon="edit" size="large" @click="handleShowSkuEditDialog(sku)" />
            </template>
            <template slot="verifyStatus" slot-scope="verifyStatus">
                <p>{{verifyStatus.verifyStatus | verifyStatusFilter}}</p>
                <p><a-button type="link">审核详情</a-button></p>
            </template>
            <template slot="action" slot-scope="action">
                <p><a-button type="link" @click="handleShowProduct(action)">查看</a-button></p>
                <p><a-button type="link" @click="handleUpdateProduct(action)">编辑</a-button></p>
                <p><a-button type="link" @click="handleShowLog(action)">日志</a-button></p>
                <p><a-button type="link" @click="handleDelete(action)">删除</a-button></p>
            </template>
        </a-table>
        <a-modal 
            :footer="null"
            v-model="editSkuInfo.dialogVisible"
        />
        <div class="batch-operate-container">
            <a-select v-model="operateType" placeholder="批量操作" style="width: 200px">
                <a-select-option v-for="item in operates" :key="item.value" :value="item.value">
                    {{item.label}}
                </a-select-option>
            </a-select>
            <a-button
                style="margin-left: 20px"
                class="search-button"
                @click="handleBatchOperate()"
                type="primary"
            >
                确定
            </a-button>
        </div>
    </div>
</template>

<script>
import { 
    getProductListWithChildren, 
    getBrandList,
    getProductList,
    updatePublishStatus,
    updateDeleteStatus
} from '@/api/product'
const columns = [
     {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: '商品图片',
        key: 'img',
        scopedSlots: { customRender: 'img' },
        width: '100px',
        align: 'center'
    },
    {
        title: '商品名称',
        key: 'brand',
        scopedSlots: { customRender: 'brand' },
        width: '120px',
        align: 'center'
    },
    {
        title: '货号/价格',
        scopedSlots: { customRender: 'productSn' },
        key: 'productSn',
        width: '130px',
        align: 'center'
    },
    {
        title: '标签',
        key: 'tags',
        scopedSlots: { customRender: 'tags' },
        width: '120px',
        align: 'center'
    },
    {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
        align: 'center'
    },
    {
        title: 'SKU库存',
        key: 'sku',
        scopedSlots: { customRender: 'sku' },
        width: '100px',
        align: 'center'
    },
    {
        title: '销量',
        dataIndex: 'sale',
        key: 'sale',
        align: 'center'
    },
    {
        title: '审核状态',
        key: 'verifyStatus',
        scopedSlots: { customRender: 'verifyStatus' },
        width: '90px',
        align: 'center'
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
        align: 'center'
    }
]
const operates = [
        {
        label: "商品上架",
        value: "publishOn"
        },
        {
        label: "商品下架",
        value: "publishOff"
        },
        {
        label: "设为推荐",
        value: "recommendOn"
        },
        {
        label: "取消推荐",
        value: "recommendOff"
        },
        {
        label: "设为新品",
        value: "newOn"
        },
        {
        label: "取消新品",
        value: "newOff"
        },
        {
        label: "转移到分类",
        value: "transferCategory"
        },
        {
        label: "移入回收站",
        value: "recycle"
        }
    ]
const defaultListQuery = {
    keyword: undefined,
    publishStatus: undefined,
    verifyStatus: undefined,
    productSn: null,
    productCategoryId: null,
    brandId: undefined,
}
    export default {
        data() {
            return {
                columns: columns,
                listQuery: Object.assign({}, defaultListQuery),
                list: [],
                productList: [],
                total: null,
                pageNumber: 1,
                pageSize: 100,
                selectProductCateValue: null,
                productCateOptions: [],
                brandOptions: [],
                publishStatusOptions: [
                    {label: '上架', value: 1},
                    {label: '下架', value: 0}
                ],
                verifyStatusOptions: [
                    {label: '审核通过', value: 1},
                    {label: '未审核', value: 0}
                ],
                loading: false,
                operates: operates,
                operateType: undefined,
                multipleSelection: [],
                pagination: {
                   total: 0,
                   pageSize: 5,
                   pageNum: 1,
                   showSizeChanger: true, 
                   pageSizeOptions:['5','10','15'],
                   showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
                   onChange: pageNum => {
                        this.pagination.pageNum = pageNum;
                        this.getList()
                    },
                    onShowSizeChange: (current, pageSize) => {
                        this.pagination.pageNum = current;
                        this.pagination.pageSize = pageSize;
                        this.getList()
                    }
                },
                editSkuInfo: {
                    dialogVisible: false,
                    productSn: '',
                    productId:null,
                    productAttributeCategoryId:null,
                    stockList:[],
                    productAttr:[],
                    keyword:undefined
                }
            }
        },
        created() {
            this.getList()
            this.getBrandListAll()
            this.getProductCateList()
        },
        watch: {
            selectProductCateValue: function (newValue) {
                if (newValue != null && newValue.length == 2) {
                    this.listQuery.productCategoryId = newValue[1];
                } else {
                    this.listQuery.productCategoryId = null;
                }
            }
        },
        computed: {
            rowSelection() {
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log(selectedRowKeys)
                        this.multipleSelection = selectedRows;
                    }
                }
            }
        },
        filters: {
            verifyStatusFilter(value) {
                return value === 1 ? '审核通过' : '未审核';
            }
        },
        mounted() {
            console.log(this.listQuery)
        },
        methods: {
            //重置表单项
            handleResetSearch(){
                // this.productCateOptions = [];
                // this.listQuery = Object.assign({}, defaultListQuery)
                this.selectProductCateValue = null;
                this.$refs.form.resetFields();
            },
            //搜索查询
            handleSearchList() {
                this.pagination.pageNum = 1;
                console.log(this.listQuery)
                this.getList();
            },
            //更改产品分类
            changeProductCategory() {},
            handleShowProduct(id) {
                console.log(id)
            },
            //更新产品
            handleUpdateProduct(row) {
                this.$router.push({path:'/pms/updateProduct',query:{id:row.id}});
            },
            handleShowLog(row) {
                console.log(row.id)
            },
            //处理删除商品
            handleDelete(row) {
                const self = this;
                this.$confirm({
                    title: '提示',
                    content: '确认删除此商品?',
                    onOk(){
                        let ids = [];
                        ids.push(row.id);
                        self.updateDeleteStatus(1, ids)
                    },
                    onCancel() {

                    }
                })
            },
            //处理编辑SKU
            handleShowSkuEditDialog(row) {
                console.log(row)
                this.editSkuInfo.dialogVisible = true;
            },
            //处理添加商品
            handleAddProduct() {
                this.$router.push({path: '/pms/addProduct'})
            },
            //获取分类列表
            async getProductCateList() {
                const res = await getProductListWithChildren();
                const productCateList = res.data.data;
                this.productCateOptions = [];
                for(let item of productCateList) {
                    let childrens = [];
                    if(item.children && item.children.length > 0) {
                        for(let children of item.children) {
                            childrens.push({value: children.name, label: children.name})
                        }
                    }
                    this.productCateOptions.push({value: item.name, label: item.name, children: childrens})
                }
            },
            //获取品牌列表
            async getBrandListAll() {
                const res = await getBrandList({pageNum: 1, pageSize: 100});
                const brandList = res.data.data.list;
                for(let item of brandList) {
                    this.brandOptions.push({label: item.name, value: item.id})
                }
            },
            //获取商品列表
            async getList() {
                this.loading = true;
                this.productList = [];
                const {pageNum, pageSize} = this.pagination;
                const params = Object.assign({}, this.listQuery, {pageNum, pageSize})
                const res = await getProductList(params);
                console.log(res)
                const { list, total } = res.data.data;
                this.pagination.total = total;
                list.map(item => {
                    this.productList.push({
                        key: item.id,
                        id: item.id,
                        pic: item.pic,
                        name: item.name,
                        brandName: item.brandName,
                        publishStatus: !!item.publishStatus,
                        newStatus: !!item.newStatus,
                        recommandStatus: !!item.recommandStatus,
                        productSn: item.productSn,
                        price: item.price,
                        sort: item.sort,
                        sale: item.sale,
                        verifyStatus: item.verifyStatus
                    })
                    console.log(this.productList)
                })
                this.loading = false;
            },
            handleBatchOperate() {
                const self = this;
                if(!this.operateType) {
                    this.$message.warning('请选择要操作的类型', 1)
                    return;
                }
                if(this.multipleSelection === null || this.multipleSelection.length < 1) {
                    this.$message.warning('请选择要操作的商品', 1)
                    return;
                }
                this.$confirm({
                    title: '提示',
                    content: '是否要进行该批量操作?',
                    okText: '确认',
                    cancelText: '取消',
                    onOk() {
                       self.multipleSelectionAll();
                    }
                })
            },
            //封装多选择操作方法
            multipleSelectionAll() {
                let ids = [];
                for(let item of this.multipleSelection) {
                    ids.push(item.id);
                }
                switch(this.operateType) {
                    case this.operates[0].value:
                         this.handleUpdatePublishStatus(1, ids);
                         break;
                    case this.operates[1].value: 
                         this.handleUpdatePublishStatus(0, ids);
                         break;  
                    case this.operates[2].value:
                        this.updateRecommendStatus(1,ids);
                        break;
                    case this.operates[3].value:
                        this.updateRecommendStatus(0,ids);
                        break;
                    case this.operates[4].value:
                        this.updateNewStatus(1,ids);
                        break;
                    case this.operates[5].value:
                        this.updateNewStatus(0,ids);
                        break;
                    case this.operates[6].value:
                        break;
                    case this.operates[7].value:
                        this.updateDeleteStatus(1,ids);
                        break;
                    default:
                        break;
                }
                this.getList();
            },
            //更新上架/下架状态
            async handleUpdatePublishStatus(publishStatus, ids) {
                //URLSearchParams 接口定义了一些实用的方法来处理 URL 的查询字符串。
                let params = new URLSearchParams();
                params.append('ids', ids);
                params.append('publishStatus', publishStatus);
                await updatePublishStatus(params);
                this.$message.success('状态修改成功', 1)
            },
            updateDeleteStatus(deleteStatus, ids) {
                let params = new URLSearchParams();
                params.append('ids', ids);
                params.append('deleteStatus', deleteStatus);
                updateDeleteStatus(params).then(res => {
                    this.$message.success(res.message)
                }).catch(err => {
                    this.$message.error(err.message)
                })
                this.getList();
            }
        },
    }
</script>

<style lang="less" scoped>
.product-list {
    margin: 10px;
    .operate-container{
        margin: 10px 0;
    }
    .batch-operate-container {
        margin-top: -48px;
    }
}
.ant-advanced-search-form {
  border-radius: 6px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}
</style>