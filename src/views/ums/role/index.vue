<template>
    <div class="role-list">
        <a-card>
            <span slot="title">
                <a-icon type="search" />
                <span>筛选搜索</span>
            </span>
            <a-form-model class="ant-advanced-search-form" :model="listQuery" ref="form">
                <a-row :gutter="24">
                    <a-col :span="8">
                        <a-form-model-item label="输入搜索" prop="keyword">
                            <a-input placeholder="角色名称" v-model.trim="listQuery.keyword"/>
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
            <div slot="extra">
                <a-button @click="handleAddRole">添加角色</a-button>
            </div>
        </a-card>
        <a-table 
            :columns="columns" 
            :data-source="roleList" 
            bordered
            :loading="loading"
            :pagination="pagination"
        >
            <template slot="createTime" slot-scope="createTime">
                <span>{{createTime.createTime | formatDateTime}}</span>
            </template>
            <template slot="status" slot-scope="status">
                <a-switch v-model="status.status" @change="handleStatusChange(status)"/>
            </template>
            <template slot="action" slot-scope="action">
                <a-button type="link" @click="handleSelectMenu(action)">分配菜单</a-button>
                <a-button type="link" @click="handleSelectResource(action)">分配资源</a-button>
                <a-button type="link" @click="handleUpdateRole(action)">编辑</a-button>
                <a-button type="link" @click="handleDeleteUser(action)">删除</a-button>
            </template>
        </a-table>
        <!-- 设置排序的模态框开始 -->
        <a-modal v-model="roleDialogVisible" :title="defaultroleDialogtitle" @ok="handleAddOrEditRole" >
            <a-form-model :model="role" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" ref="roleForm">
                <a-form-model-item label="角色名称" prop="name">
                    <a-input v-model="role.name"/>
                </a-form-model-item>
                <a-form-model-item label="描述" prop="description">
                    <a-input v-model="role.description" type="textarea" :rows="5"/>
                </a-form-model-item>
                <a-form-model-item label="是否启用" prop="status">
                    <a-radio-group v-model="role.status">
                        <a-radio  :value="1">是</a-radio>
                        <a-radio  :value="0">否</a-radio>
                    </a-radio-group>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
        <!-- 设置排序的模态框结束 -->
    </div>
</template>

<script>
import { allocRole, getRoleList, addRole, updateRole, deleteRole, updateStatus } from '@/api/role'
import { formatDate } from '@/utils/date';
const roleColumns = [
     {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: '角色名称',
        key: 'name',
        dataIndex: 'name',
        align: 'center'
    },
    {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        align: 'center'
    },
    {
        title: '用户数',
        key: 'adminCount',
        dataIndex: 'adminCount',
        align: 'center'
    },
    {
        title: '添加时间',
        scopedSlots: { customRender: 'createTime' },
        key: 'createTime',
        align: 'center'
    },
    {
        title: '是否启用',
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
    keyword: undefined
}
//默认用户数据
const defaultRole = {
    id: null,
    name: null,
    description: null,
    adminCount: 0,
    status: 1
};
    export default {
        data() {
            return {
                //角色表格列
                columns: roleColumns,
                //查询参数
                listQuery: Object.assign({}, defaultListQuery),
                //用户数据
                role: Object.assign({}, defaultRole),
                //角色列表
                roleList: [],
                //表格加载数据loading
                loading: false,
                //用户列表表格分页配置项
                pagination: {
                   total: 0,
                   pageNum: 1,
                   pageSize: 5,
                   showSizeChanger: true, 
                   pageSizeOptions:['5','10','15'],
                   showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
                   onChange: pageNum => {
                        this.pagination.pageNum = pageNum;
                        this.getRoleListData()
                    },
                    onShowSizeChange: (current, pageSize) => {
                        this.pagination.pageNum = current;
                        this.pagination.pageSize = pageSize;
                        this.getRoleListData()
                    }
                },
                //角色模态框
                roleDialogVisible: false,
                defaultroleDialogtitle: '添加角色',
                //表单校验规则
                rules: {
                    name: [
                        { required: true, message: '角色名不能为空', trigger: 'blur' },
                        { min: 2, max: 8, message: '角色名需要2-8个字符', trigger: 'blur' },
                    ],
                },
                //Model是否为编辑状态,默认是false
                isEdit: false,
            }
        },
        created() {
            //获取角色列表
            this.getRoleListData()
        },
        computed: {},
        filters:{
            //处理优惠券类型
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
                let { keyword } = this.listQuery;
                if(keyword) {
                    this.$refs.form.resetFields();
                    this.getUserListData();
                } else {
                    return false;
                }
            },
            //搜索查询
            handleSearchList() {
                let { keyword } = this.listQuery;
                if(keyword) {
                    //重置pageNum为1
                    this.pagination.pageNum = 1;
                    this.getUserListData();
                } else {
                    return false;
                }
            },
            //获取角色列表
            async getRoleListData() {
                this.loading = true;
                this.roleList = [];
                const { pageNum, pageSize } = this.pagination;
                const params = Object.assign({}, this.listQuery, {pageNum, pageSize})
                const res = await getRoleList(params);
                const { list, total } = res.data.data;
                this.pagination.total = total;
                list.map(item => {
                    this.roleList.push({
                        key: item.id,
                        id: item.id,
                        description: item.description,
                        adminCount: item.adminCount,
                        createTime: item.createTime,
                        name: item.name,
                        status: !!item.status
                    })
                })
                this.loading = false;
            },
            //处理打开模态框设置完成并确定后的函数
            handleAddOrEditRole(){
                const _self = this;
                this.$confirm({
                    title: '提示',
                    content: this.isEdit ? '是否确定修改?' : '是否确定添加?',
                    onOk() {
                        // 如果是编辑用户
                        if(_self.isEdit) {
                            _self.$refs.roleForm.validate(valid => {
                                if(valid) {
                                    let { status } = _self.role;
                                    status = status ? 1 : 0;
                                    _self.role = Object.assign({},_self.role, {status: status});
                                    updateRole(_self.role.id, _self.role).then(res => {
                                        _self.$message.success(res.data.message);
                                        _self.getRoleListData();
                                    }).catch(error => {
                                        _self.$message.error(error.message);
                                    })
                                    _self.roleDialogVisible = false;
                                } else {
                                    return false;
                                }
                            })
                        } else {
                            //添加用户
                             _self.$refs.roleForm.validate(valid => {
                                if(valid) {
                                    addRole(_self.role).then(res => {
                                        _self.$message.success(res.message);
                                        _self.getRoleListData();
                                    }).catch(error => {
                                        _self.$message.error(error.message);
                                    })
                                    _self.roleDialogVisible = false;
                                } else {
                                    return false;
                                }
                            })
                        }
                    }
                })
            },
            //删除某个角色
            handleDeleteUser(row) {
                const _self = this;
                this.$confirm({
                    title: '提示',
                    content: '是否要删除该角色?',
                    onOk(){
                        let ids = [];
                        ids.push(row.id);
                        let params=new URLSearchParams();
                        params.append("ids",ids);
                        deleteRole(params).then(res => {
                            _self.$message.success(res.message)
                            _self.getRoleListData()
                        }).catch(error => {
                            _self.$message.error(error.message)
                        })
                    }
                })
            },
            //编辑角色信息
            handleUpdateRole(row) {
                this.roleDialogVisible = true;
                this.defaultroleDialogtitle = '编辑角色';
                this.$nextTick(() => {
                    this.$refs.roleForm.resetFields();
                    let { status } = row;
                    status = status ? 1 : 0;
                    this.role = Object.assign({},row, {status: status});
                })
                this.isEdit = true;
            },
            //更新是否启用
            handleStatusChange(row){
                const _self = this;
                this.$confirm({
                    title: '提示',
                    content: '是否要修改该状态?',
                    onOk(){
                        //处理需要发送给后台的数据(推荐状态)
                        let status = row.status ? 1 : 0;
                        updateStatus(row.id, {status: status}).then(res => {
                            _self.$message.success(res.message)
                        }).catch(error => {
                            _self.$message.error(error.message)
                        })
                        _self.getRoleListData()
                    }
                })
            },
            //添加角色的处理函数
            handleAddRole() {
                this.roleDialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.roleForm.resetFields();
                })
                this.isEdit = false;
            },
            //分配角色
            handleSelectRole(row){
                this.allocAdminId = row.id;
                this.roleDialogVisible = true;
                this.allocRoleIds = [];
                this.getRoleListByUserId(row.id);
            },
            //确定分配角色逻辑
            handleAllocConfirm(){
                const _self = this;
                this.$confirm({
                    title: '提示',
                    content: '是否确认分配?',
                    onOk(){
                        let params = new URLSearchParams();
                        params.append('adminId', _self.allocAdminId);
                        params.append('roleIds', _self.allocRoleIds);
                        allocRole(params).then(res => {
                            _self.$message.success(res.message);
                        }).catch(error => {
                            _self.$message.error(error.message);
                        })
                        _self.roleDialogVisible = false;
                    }
                })
            },
            //分配菜单
            handleSelectMenu(row) {
                this.$router.push({path: '/ums/allocResource', query: {roleId:row.id}})
            },
            //分配资源
            handleSelectResource(row) {
                this.$router.push({path: '/ums/allocResource', query:{roleId:row.id}})
            }
        },
    }
</script>

<style lang="less" scoped>
.role-list {
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