<template>
    <div class="brand-list">
        <a-card>
            <span slot="title">
                <a-icon type="search" />
                <span>筛选搜索</span>
            </span>
            <a-form-model class="ant-advanced-search-form" :model="listQuery" ref="form">
                <a-row :gutter="24">
                    <a-col :span="6">
                        <a-form-model-item label="资源名称" prop="nameKeyword">
                            <a-input placeholder="资源名称" v-model.trim="listQuery.nameKeyword"/>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-model-item label="资源路径" prop="urlKeyword">
                            <a-input placeholder="资源路径" v-model.trim="listQuery.urlKeyword"/>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-model-item label="资源分类" prop="categoryId">
                            <a-select v-model="listQuery.categoryId" allowClear placeholder="全部" style="width: 171px" @change="handleSelectChange(listQuery.categoryId)">
                                <a-select-option v-for="option in categoryOptions" :vlaue="option.value" :key="option.value" >
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
             <div slot="extra" style="display: inline-block">
                <a-button @click="handleShowCategory()">资源分类</a-button>
            </div>
             <div slot="extra" style="display: inline-block; margin-left: 10px">
                <a-button @click="handleAddResource()">添加资源</a-button>
            </div>
        </a-card>
        <a-table 
            :columns="columns" 
            :data-source="resourceList" 
            bordered
            :loading="loading"
            :pagination="pagination"
        >
            <template slot="description" slot-scope="description">
                <span>{{description.description | formatDescription}}</span>
            </template>
            <template slot="createTime" slot-scope="createTime">
                <span>{{createTime.createTime | formatDateTime}}</span>
            </template>
            <template slot="action" slot-scope="action">
                <a-button type="link" @click="handleEditResource(action)">编辑</a-button>
                <a-button type="link" @click="handleDeleteResoure(action)">删除</a-button>
            </template>
        </a-table>
        <!-- 设置模态框开始 -->
        <a-modal v-model="resourceDialogVisible" :title="title" @ok="handleAddOrEditResource">
            <a-form-model :model="resource" :rules="rules" :label-col="{ span: 7 }" :wrapper-col="{ span: 13 }" ref="resourceForm">
                <a-form-model-item label="资源名称" prop="name">
                    <a-input v-model="resource.name"/>
                </a-form-model-item>
                <a-form-model-item label="资源路径" prop="url">
                    <a-input v-model="resource.url"/>
                </a-form-model-item>
                <a-form-model-item label="资源分类" prop="categoryId">
                    <a-select v-model="resource.categoryId" allowClear placeholder="请选择资源分类">
                        <a-select-option v-for="option in categoryOptions" :vlaue="option.value" :key="option.value" >
                            {{option.label}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="描述" prop="description">
                    <a-input v-model="resource.description" type="textarea" :rows="4"/>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import {
    deleteBrand,
    updateRecommendStatus
} from '@/api/brand'
import { formatDate } from '@/utils/date';
import { getResourceList, addResource, updateResource } from '@/api/resource'
import { getResourceCategoryList } from '@/api/resourceCategory'
const resourceColumns = [
     {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: '资源名称',
        key: 'name',
        dataIndex: 'name',
        align: 'center'
    },
    {
        title: '资源路径',
        key: 'url',
        dataIndex: 'url',
        align: 'center'
    },
    {
        title: '描述',
        key: 'description',
        scopedSlots: { customRender: 'description' },
        align: 'center'
    },
    {
        title: '添加时间',
        scopedSlots: { customRender: 'createTime' },
        key: 'createTime',
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
    nameKeyword: undefined,
    urlKeyword: undefined,
    categoryId:undefined
};
//资源默认值
const defaultResource = {
    id: undefined,
    name: undefined,
    url: undefined,
    categoryId: undefined,
    description:''
};
    export default {
        data() {
            return {
                //优惠券表格列
                columns: resourceColumns,
                //查询参数
                listQuery: Object.assign({}, defaultListQuery),
                //资源分类选项列表
                categoryOptions: [],
                resource: Object.assign({}, defaultResource),
                //资源列表
                resourceList: [],
                //表格加载数据loading
                loading: false,
                //资源表格分页配置项
                pagination: {
                   total: 0,
                   pageNum: 1,
                   pageSize: 10,
                   showSizeChanger: true, 
                   pageSizeOptions:['5','10','15'],
                   showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
                   onChange: pageNum => {
                        this.pagination.pageNum = pageNum;
                        this.getResourcetListData()
                    },
                    onShowSizeChange: (current, pageSize) => {
                        this.pagination.pageNum = current;
                        this.pagination.pageSize = pageSize;
                        this.getResourcetListData()
                    }
                },
                //资源表单验证规则
                rules: {
                    name: [
                        { required: true, message: '资源名称不能为空', trigger: 'blur' }
                    ],
                    url: [
                        { required: true, message: '资源路径不能为空', trigger: 'blur' }
                    ],
                    categoryId: [
                        { required: true, message: '资源分类不能为空', trigger: 'blur' }
                    ]
                },
                //添加/编辑资源模态框
                resourceDialogVisible: false,
                //添加/编辑资源模态框title
                title: '添加资源',
                //是添加资源还是编辑资源
                isEdit: false
            }
        },
        created() {
            // 获取资源列表
            this.getResourcetListData();
            // 获取资源分类列表
            this.getResourceCategoryListData();
        },
        computed: {},
        filters:{
            //处理优惠券类型
            formatRecommendStatus(status){
                return status === 1 ? '推荐中' : '未推荐';
            },
            //处理描述
            formatDescription(description) {
                return description ? description : '暂无描述'
            },
            //处理时间
            formatDateTime(time) {
                if (time == null || time === '') {
                    return '暂无数据';
                }
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
            }
        },
        methods: {
            //重置表单项
            handleResetSearch(){
                let { nameKeyword, urlKeyword, categoryId } = this.listQuery;
                if(nameKeyword || urlKeyword || categoryId) {
                    this.$refs.form.resetFields();
                    this.getResourcetListData();
                } else {
                    return false;
                }
            },
            //搜索查询
            handleSearchList() {
                let { nameKeyword, urlKeyword, categoryId } = this.listQuery;
                if(nameKeyword || urlKeyword || categoryId) {
                    //重置pageNum为1
                    this.pagination.pageNum = 1;
                    this.getResourcetListData();
                } else {
                    return false;
                }
            },
            //清除下拉框的选项时的函数
            handleSelectChange(option){
                if(option === undefined) {
                    this.getResourcetListData();
                }
            },
            //获取资源列表
            async getResourcetListData() {
                this.loading = true;
                this.resourceList = [];
                const { pageNum, pageSize } = this.pagination;
                const params = Object.assign({}, this.listQuery, {pageNum, pageSize})
                const res = await getResourceList(params);
                const { list, total } = res.data.data;
                console.log(res);
                this.pagination.total = total;
                list.map(item => {
                    this.resourceList.push({
                        key: item.id,
                        id: item.id,
                        name: item.name,
                        url: item.url,
                        createTime: item.createTime,
                        categoryId: item.categoryId
                    })
                })
                this.loading = false;
            },
            //获取资源分类列表
            async getResourceCategoryListData() {
                const res = await getResourceCategoryList();
                const list = res.data.data;
                for(let item of list) {
                    this.categoryOptions.push({label: item.name, value: item.id})
                }
            },
            //点击资源分类
            handleShowCategory(){
                this.$router.push({path: '/ums/resourceCategory'})
            },
            //添加资源函数
            handleAddResource(){
                this.resourceDialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.resourceForm.resetFields();
                    this.isEdit = false;
                })
            },
            //编辑资源函数
            handleEditResource(row) {
                this.resourceDialogVisible = true;
                this.title = '编辑资源';
                this.$nextTick(() => {
                    this.$refs.resourceForm.resetFields();
                    this.resource = Object.assign({}, row);
                    this.isEdit = true;
                })
            },
            //处理打开模态框设置完成并确定后的函数
            handleAddOrEditResource(){
                const _self = this;
                this.$confirm({
                    title: '提示',
                    content: this.isEdit ? '是否确定修改资源?' : '是否确定添加资源?',
                    onOk() {
                        // 如果是编辑资源
                        if(_self.isEdit) {
                            _self.$refs.resourceForm.validate(valid => {
                                if(valid) {
                                    updateResource(_self.resource.id, _self.resource).then(res => {
                                        _self.$message.success(res.data.message);
                                        _self.getResourcetListData();
                                    }).catch(error => {
                                        _self.$message.error(error.message);
                                    })
                                    _self.resourceDialogVisible = false;
                                } else {
                                    return false;
                                }
                            })
                        } else {
                            //添加资源
                             _self.$refs.resourceForm.validate(valid => {
                                if(valid) {
                                    addResource(_self.resource).then(res => {
                                        _self.$message.success(res.message);
                                        _self.getResourcetListData();
                                    }).catch(error => {
                                        _self.$message.error(error.message);
                                    })
                                    _self.resourceDialogVisible = false;
                                } else {
                                    return false;
                                }
                            })
                        }
                    }
                })
            },
            //删除某个资源
            handleDeleteSource(row) {
                this.handleDeleteBrand(row.id)
            },
            //更新是否推荐
            handleUpdateRecommendStatusChange(row){
                //处理需要发送给后台的数据(推荐状态)
                let status = row.recommendStatus ? 1 : 0;
                this.handleUpdateRecommendStatus(row.id, status);
            },
            //添加优惠券的处理函数
            handleAddCoupon() {
                this.$router.push({path: '/sms/addCoupon'})
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