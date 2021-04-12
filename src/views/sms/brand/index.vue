<template>
    <div class="brand-list">
        <a-card>
            <span slot="title">
                <a-icon type="search" />
                <span>筛选搜索</span>
            </span>
            <a-form-model class="ant-advanced-search-form" :model="listQuery" ref="form">
                <a-row :gutter="24">
                    <a-col :span="8">
                        <a-form-model-item label="品牌名称" prop="name">
                            <a-input placeholder="品牌名称" v-model.trim="listQuery.brandName"/>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="推荐状态" prop="status">
                            <a-select v-model="listQuery.recommendStatus" allowClear placeholder="全部" style="width: 171px" @change="handleSelectChange(listQuery.recommendStatus)">
                                <a-select-option v-for="option in recommendOptions" :vlaue="option.value" :key="option.value" >
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
        </a-card>
        <a-table 
            :columns="columns" 
            :data-source="couponList" 
            bordered
            :row-selection="rowSelection"
            :loading="loading"
            :pagination="pagination"
            @onSelect="handleSelectionChange"
        >
            <template slot="recommendStatus" slot-scope="recommendStatus">
                <a-switch v-model="recommendStatus.recommendStatus" @change="handleUpdateRecommendStatusChange(recommendStatus)"/>
            </template>
            <template slot="status" slot-scope="status">
                <span>{{status.status | formatRecommendStatus}}</span>
            </template>
            <template slot="action" slot-scope="action">
                <a-button type="link" @click="handleView(action)">设置排序</a-button>
                <a-button type="link" @click="handleDelete(action)">删除</a-button>
            </template>
        </a-table>
        <!-- 设置排序的模态框开始 -->
        <a-modal v-model="sortDialogVisible" title="设置排序" @ok="handleSortOk">
            <a-form-model :model="sortDialogData" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-form-model-item label="排序" prop="sort">
                    <a-input v-model="sortDialogData.sort"/>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
        <!-- 设置排序的模态框结束 -->
        <div class="batch-operate-container">
            <a-select v-model="operateType" placeholder="批量操作" style="width: 200px">
                <a-select-option v-for="item in operateOptions" :key="item.value" :value="item.value">
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
    getHomeBrandList,
    deleteBrand,
    updateBrandSort,
    updateRecommendStatus
} from '@/api/brand'
const brandColumns = [
     {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: '品牌名称',
        key: 'name',
        dataIndex: 'name',
        align: 'center'
    },
    {
        title: '是否推荐',
        scopedSlots: { customRender: 'recommendStatus' },
        key: 'recommendStatus',
        align: 'center'
    },
    {
        title: '排序',
        key: 'sort',
        dataIndex: 'sort',
        align: 'center'
    },
    {
        title: '状态',
        scopedSlots: { customRender: 'status' },
        key: 'status',
        align: 'center'
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
        align: 'center'
    }
]
//默认查询参数列表
const defaultListQuery = {
    brandName: undefined,
    recommendStatus: undefined
}
//默认优惠券类型
const defaultRecommendOptions=[
    {
      label: '未推荐',
      value: 0
    },
    {
      label: '推荐中',
      value: 1
    }
  ];
    export default {
        data() {
            return {
                //优惠券表格列
                columns: brandColumns,
                //查询参数
                listQuery: Object.assign({}, defaultListQuery),
                //优惠券类型
                recommendOptions: Object.assign({}, defaultRecommendOptions),
                //优惠券列表
                couponList: [],
                //表格加载数据loading
                loading: false,
                //订单表格分页配置项
                pagination: {
                   total: 0,
                   pageNum: 1,
                   pageSize: 5,
                   showSizeChanger: true, 
                   pageSizeOptions:['5','10','15'],
                   showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
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
                //批量操作选项
                operateOptions: [
                    {
                        label: "设为推荐",
                        value: 0
                    },
                    {
                        label: "取消推荐",
                        value: 1
                    },
                    {
                        label: "删除",
                        value: 2
                    }
                ],
                //批量操作的选择项
                multipleSelection: [],
                operateType: null,
                //设置排序模态框
                sortDialogVisible: false,
                //设置排序初始数据
                sortDialogData:{
                    sort:0,
                    id:null
                }
            }
        },
        created() {
            this.getBrandListData()
        },
        computed: {
            //选择某一行后的计算属性
            rowSelection() {
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log(selectedRowKeys, selectedRows)
                        this.multipleSelection = selectedRows;
                    }
                }
            }
        },
        filters:{
            //处理优惠券类型
            formatRecommendStatus(status){
                return status === 1 ? '推荐中' : '未推荐';
            }
        },
        methods: {
            //重置表单项
            handleResetSearch(){
                let { brandName, recommendStatus } = this.listQuery;
                if(brandName || recommendStatus !== undefined) {
                    this.$refs.form.resetFields();
                    this.getBrandListData();
                } else {
                    return false;
                }
            },
            //搜索查询
            handleSearchList() {
                let { brandName, recommendStatus } = this.listQuery;
                if(brandName || recommendStatus !== undefined) {
                    //重置pageNum为1
                    this.pagination.pageNum = 1;
                    this.getBrandListData();
                } else {
                    return false;
                }
            },
            //清除下拉框的选项时的函数
            handleSelectChange(status){
                if(status === undefined) {
                    this.getBrandListData();
                }
            },
            //获取品牌列表
            async getBrandListData() {
                this.loading = true;
                this.couponList = [];
                const { pageNum, pageSize } = this.pagination;
                const params = Object.assign({}, this.listQuery, {pageNum, pageSize})
                const res = await getHomeBrandList(params);
                const { list, total } = res.data.data;
                console.log(res);
                this.pagination.total = total;
                list.map(item => {
                    this.couponList.push({
                        key: item.id,
                        id: item.id,
                        name: item.brandName,
                        recommendStatus: !!item.recommendStatus,
                        status: item.recommendStatus,
                        sort: item.sort
                    })
                })
                this.loading = false;
            },
            //设置排序打开模态框函数
            handleView(row){
                this.sortDialogVisible = true;
                this.sortDialogData.sort = row.sort;
                this.sortDialogData.id = row.id;
            },
            //处理打开模态框设置完成并确定后的函数
            handleSortOk(){
                const _self = this;
                this.$confirm({
                    title: '提示',
                    content: '是否要修改排序?',
                    onOk() {
                        _self.sortDialogVisible = false;
                        let { id } = _self.sortDialogData
                        updateBrandSort(_self.sortDialogData, id).then(res => {
                            _self.$message.success(res.data.message)
                            _self.getBrandListData();
                        }).catch(error => {
                            _self.$message.error(error.message)
                        })
                    }
                })
            },
            //删除某个品牌
            handleDelete(row) {
                this.handleDeleteBrand(row.id)
            },
            //更新是否推荐
            handleUpdateRecommendStatusChange(row){
                //处理需要发送给后台的数据(推荐状态)
                let status = row.recommendStatus ? 1 : 0;
                this.handleUpdateRecommendStatus(row.id, status);
            },
            //选择项点击回调
            handleSelectionChange(changeableRowKeys) {
                this.multipleSelection = changeableRowKeys;
            },
            //添加优惠券的处理函数
            handleAddCoupon() {
                this.$router.push({path: '/sms/addCoupon'})
            },
            //批量操作处理函数
            handleBatchOperate() {
                if(this.operateType === null ) {
                    this.$message.warning('请选择要操作的类型', 1)
                    return;
                }
                if(this.multipleSelection === null || this.multipleSelection.length < 1) {
                    this.$message.warning('请选择要操作的订单', 1)
                    return;
                }
                let ids=[];
                for(let item of this.multipleSelection) {
                    ids.push(item.id);
                }
                if(this.operateType === 0) {
                    //批量推荐
                    this.handleUpdateRecommendStatus(ids, 1)
                } else if(this.operateType === 1) {
                    //批量取消推荐
                    this.handleUpdateRecommendStatus(ids, 0)
                } else if(this.operateType === 2) {
                    //批量删除
                    this.handleDeleteBrand(ids);
                }
            },
            //批量更新推荐状态函数
            handleUpdateRecommendStatus(ids, status) {
                let _self = this;
                this.$confirm({
                    title: '提示',
                    content: '是否要更新推荐状态?',
                    onOk(){
                        let params = new URLSearchParams();
                        let ids=[];
                        params.append("ids",ids);
                        params.append("recommendStatus",status);
                        updateRecommendStatus(params).then(res=> {
                            _self.$message.success(res.data.message)
                        }).catch(error => {
                            _self.$message.error(error.message)
                        })
                        _self.getBrandListData();
                    }
                })
            },
            //删除品牌
            handleDeleteBrand(ids) {
                let _self = this;
                this.$confirm({
                    title: '提示',
                    content: '是否要删除已选择的品牌?',
                    onOk(){
                        let params = new URLSearchParams();
                        params.append("ids",ids);
                        deleteBrand(params).then(res=> {
                            _self.$message.success(res.data.message)
                            _self.getBrandListData();
                        }).catch(error => {
                            _self.$message.error(error.message)
                        })
                    }
                })
            }
        },
    }
</script>

<style lang="less" scoped>
.brand-list {
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