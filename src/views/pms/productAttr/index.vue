<template>
    <div class="product-attr">
        <a-card class="operate-container">
            <span slot="title">
                <a-icon type="file-text" theme="filled" />
                <span>列表数据</span>
            </span>
            <a-button slot="extra" @click="addProductAttrCate()">添加</a-button>
        </a-card>
        <a-table
            :columns="productAttrColumns" 
            :data-source="productAttrData" 
            bordered
            :pagination="pagination"
            :loading="loading"
        >
            <template slot="setting" slot-scope="setting">
                <a-button style="margin-bottom: 10px" @click="getAttrList(setting)">属性列表</a-button>
                <a-button @click="getParamList(setting)">参数列表</a-button>
            </template>
            <template slot="action" slot-scope="action">
                <a-button style="margin-right: 10px" @click="handleUpdate(action)">编辑</a-button>
                <a-button type="danger">删除</a-button>
            </template>
        </a-table>
        <a-modal 
            width="30%"
            v-model="visible"
            :title="defaultTitle"
            @cancel="cancelModal" 
            destroyOnClose
        >
            <a-form-model 
                :label-col="labelCol" 
                :wrapper-col="wrapperCol" 
                :model="productAttrCate" 
                :rules="rules"
                ref="productAttrCatForm"
            >
                <a-form-model-item label="类型名称" prop="name">
                    <a-input v-model="productAttrCate.name" />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
const productAttrColumns = [
    {
        title: '编号',
        dataIndex: 'id',
        align: 'center'
    },
    {
        title: '类型名称',
        dataIndex: 'name',
        align: 'center'
    },
    {
        title: '属性数量',
        dataIndex: 'attributeCount',
        align: 'center'
    },
    {
        title: '参数数量',
        dataIndex: 'paramCount',
        align: 'center'
    },
    {
        title: '设置',
        scopedSlots: {customRender: 'setting'},
        align: 'center',
        width: '200px'
    },
    {
        title: '操作',
        scopedSlots: {customRender: 'action'},
        align: 'center',
        width: '200px'
    }
]
import { getproductAttributeList } from '@/api/product'
    export default {
        data() {
            return {
                loading: false, 
                visible: false,
                labelCol:{span: 5},
                wrapperCol: {span: 18},
                defaultTitle: '',
                pagination: {
                    total: 0,
                    pageNum: 1,
                    pageSize: 5,//每页中显示1多少条数据
                    showSizeChanger: true, //是否可以改变 pageSize
                    pageSizeOptions: ["5", "10", "15"],//每页中显示的数据
                    showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
                    onChange: pageNum => {
                        this.pagination.pageNum = pageNum;
                        this.getProductAttribute()
                    },
                    onShowSizeChange: (current, pageSize) => {
                        this.pagination.pageNum = current;
                        this.pagination.pageSize = pageSize;
                        this.getProductAttribute()
                    }
                },
                productAttrCate: {
                    name: '',
                    id: null
                },
                productAttrData: [],
                productAttrColumns: productAttrColumns,
                rules: {
                    name: [
                        { required: true, message: '请输入类型名称', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.getProductAttribute()
        },
        methods: {
            async getProductAttribute() {
                this.loading = true;
                this.productAttrData = [];
                const {pageNum, pageSize} = this.pagination
                const res = await getproductAttributeList({pageNum, pageSize});
                console.log(res);
                const { list, total } = res.data.data;
                this.pagination.total = total;
                list.map(item => {
                    this.productAttrData.push({
                        key: item.id,
                        id: item.id,
                        attributeCount: item.attributeCount,
                        name: item.name,
                        paramCount: item.paramCount
                    })
                })
                this.loading = false
            },
            //获取属性列表
            getAttrList(row){
                this.$router.push({path: '/pms/productAttrList', query: {cid: row.id, cname: row.name, type: 0}})
            },
            //获取参数列表
            getParamList(row) {
                this.$router.push({path: '/pms/productAttrList', query: {cid: row.id, cname: row.name, type: 1}})
            },
            //添加类型
            addProductAttrCate() {
                this.defaultTitle = '添加类型'
                this.visible = true;
            },
            //点击关闭maodal曾后的回调
            cancelModal(){
                this.$refs.productAttrCatForm.resetFields()
                this.productAttrCate.name = ''
            },
            handleUpdate(row) {
                this.visible = true;
                this.defaultTitle='编辑类型'
                this.productAttrCate.name=row.name;
                this.productAttrCate.id=row.id
            }
        },
    }
</script>

<style lang="less" scoped>
.product-attr {
    margin: 10px;
    .operate-container {
        margin-bottom: 10px;
    }
}
</style>