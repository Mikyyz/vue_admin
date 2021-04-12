<template>
    <div class="brand">
        <a-card>
            <span slot="title">
                <a-icon type="search" />
                <span>筛选搜索</span>
            </span>
            <div class="search-wrapper">
                <a-form-model :model="listQuery" v-bind="layout" ref="searchBrandForm">
                    <a-form-model-item label="输入搜索" colon :labelCol="labelCol" :wrapperCol="wrapperCol" prop="keyword">
                        <a-input placeholder="品牌名称/关键字" v-model="listQuery.keyword"/>
                    </a-form-model-item>
                </a-form-model>
                <a-button style="margin-left: 27px" @click="resetForm()">重置</a-button>
                <a-button type="primary" style="margin-left: 10px" @click="searchBrandList()">查询结果</a-button>
            </div>
        </a-card>
        <a-card class="operate-container">
            <span slot="title">
                <a-icon type="file-text" theme="filled" />
                <span>列表数据</span>
            </span>
            <a-button slot="extra" @click="handleAddBrand()">添加</a-button>
        </a-card>
        <a-table 
            :columns="brandColumns"
            :data-source="brandList"
            bordered 
            :pagination="pagination"
            :loading="loading"
            :row-selection="rowSelection"
        >
            <template slot="brandFactory" slot-scope="brandFactory">
                <a-switch v-model="brandFactory.factoryStatus"/>
            </template>
            <template slot="ShowStatus" slot-scope="ShowStatus">
                <a-switch v-model="ShowStatus.showStatus"/>
            </template>
            <template slot="relation">
                <span>商品:</span>
                <a-button type="link">100</a-button>
                <span>评论:</span>
                <a-button type="link">1000</a-button>
            </template>
            <template slot="action" slot-scope="action">
                <a-button style="margin-right: 10px" @click="handleUpdate(action)">编辑</a-button>
                <a-button type="danger" @click="handleDelete(action)">删除</a-button>
            </template>
        </a-table>
        <div class="batch-operate-container">
            <a-select v-model="operateType" placeholder="批量操作" style="width: 200px">
                <a-select-option v-for="item in operates" :key="item.value" value="">
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
import { getBrandList, deleteBrandById, updateBrandShowStatus } from '@/api/product'
const brandColumns = [
    {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: '品牌名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
    },
    {
        title: '品牌首字母',
        dataIndex: 'firstLetter',
        key: 'firstLetter',
        align: 'center'
    },
    {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
        align: 'center'
    },
    {
        title: '品牌制造商',
        scopedSlots: { customRender: 'brandFactory' },
        key: 'brandFactory',
        align: 'center'
    },
    {
        title: '是否显示',
        scopedSlots: { customRender: 'ShowStatus' },
        key: 'ShowStatus',
        align: 'center'
    },
    {
        title: '相关',
        scopedSlots: { customRender: 'relation' },
        key: 'relation',
        align: 'center',
        width: '250px'
    },
    {
        title: '操作',
        scopedSlots: { customRender: 'action' },
        key: 'action',
        align: 'center',
        width: '200px'
    }
]
    export default {
        data() {
            return {
                //品牌列数据
                brandColumns: brandColumns,
                //品牌列表
                brandList: [],
                loading: false,
                //批量操作类型
                operateType: undefined,
                listQuery: {
                    keyword: null,
                },
                layout: {
                    wrapperCol: {span: 20}
                },
                labelCol: {
                    span: 2
                },
                wrapperCol: {
                    span: 5
                },
                //批量操作选项
                operates: [
                    {
                        label: "显示品牌",
                        value: "showBrand"
                    },
                    {
                        label: "隐藏品牌",
                        value: "hideBrand"
                    }
                ],
                //分页配置
                pagination: {
                    total: 0,
                    pageNum: 1,//第几页
                    pageSize: 10,//每页显示多少条数据
                    showSizeChanger: true, //是否可以改变 pageSize
                    pageSizeOptions: ["5", "10", "15"],//每页中显示的数据
                    showTotal: total => `共有 ${total} 条数据`, //分页中显示的数据,
                    onChange: pageNum => {
                        this.pagination.pageNum = pageNum;
                        this.getBrandListData()
                    },
                    onShowSizeChange: (current, pageSize) => {
                        this.pagination.pageNum = current;
                        this.pagination.pageSize = pageSize;
                        this.getBrandListData()
                    }
                },
                //用户多选
                multipleSelection: []
            }
        },
        created() {
            this.getBrandListData();
        },
        computed:{
            rowSelection() {
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log(selectedRowKeys, selectedRows)
                        this.multipleSelection = selectedRows;
                    }
                }
            }
        },
        methods: {
            //获取品牌列表
            async getBrandListData() {
                this.brandList = []
                this.loading = true;
                const { pageSize, pageNum } = this.pagination;
                const res = await getBrandList({pageNum, pageSize, ...this.listQuery.keyword})
                const { list, total } = res.data.data;
                console.log(list)
                this.pagination.total = total;
                list.map(item => {
                    this.brandList.push({
                        key: item.id,
                        id: item.id,
                        name: item.name,
                        firstLetter: item.firstLetter,
                        sort: item.sort,
                        factoryStatus: !!item.factoryStatus,
                        showStatus: !!item.showStatus
                    })
                });
                this.loading = false;
            },
            //重置
            resetForm() {
                this.$refs.searchBrandForm.resetFields()
            },
            //查询结果
            searchBrandList() {
                this.pagination.pageNum = 1;
                console.log(this.listQuery.keyword)
                this.getBrandListData()
            },
            //添加
            handleAddBrand(){
                this.$router.push({path: '/pms/addBrand'})
            },
            //编辑
            handleUpdate(row) {
                this.$router.push({path: '/pms/updateBrand', query: {id: row.id}})
            },
            //删除
            handleDelete(row) {
                const self = this;
                this.$confirm({
                    title: '提示',
                    content: '是否要删除该品牌',
                    async onOk() {
                        try {
                            const res = await deleteBrandById(row.id);
                            if(res.code === 200) {
                                self.$message.success(res.message);
                                self.getBrandListData();
                                
                            }
                        } catch (error) {
                            self.$message.error(error.message)
                        }
                        
                    },
                })
            },
            //批量操作
            handleBatchOperate(){
                if(this.multipleSelection.length < 1){
                    this.$message.warning('请选择一条记录');
                    return
                }
                let showStatus = 0;
                if(this.operateType === 'showBrand') {
                    showStatus = 1;
                } else if(this.operateType === 'hideBrand') {
                    showStatus = 0;
                } else {
                    this.$message.warning('请选择批量操作类型')
                    return
                }
                let ids = [];
                for(let item of this.multipleSelection) {
                    ids.push(item.id)
                }
                let data = new URLSearchParams();
                data.append("ids", ids);
                data.append("showStatus", showStatus);
                updateBrandShowStatus(data).then(res => {
                    console.log(res)
                    this.$message.success(res.message)
                }).catch(err => {
                    console.log(err)
                    this.$message.error(err.message)
                })
            }
        },
    }
</script>

<style lang="less" scoped>
.brand {
    margin: 10px;
    .operate-container {
        margin: 10px 0;
    }
    .batch-operate-container {
        margin-top: -48px;
    }
}
</style>