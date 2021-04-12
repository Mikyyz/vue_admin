<template>
    <div class="admin-list">
        <a-card>
            <span slot="title">
                <a-icon type="search" />
                <span>筛选搜索</span>
            </span>
            <a-form-model class="ant-advanced-search-form" :model="listQuery" ref="form">
                <a-row :gutter="24">
                    <a-col :span="8">
                        <a-form-model-item label="输入搜索" prop="keyword">
                            <a-input placeholder="账号/姓名" v-model.trim="listQuery.keyword"/>
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
                <a-button @click="handleAddUser">添加用户</a-button>
            </div>
        </a-card>
        <a-table 
            :columns="columns" 
            :data-source="userList" 
            bordered
            :loading="loading"
            :pagination="pagination"
        >
            <template slot="createTime" slot-scope="createTime">
                <span>{{createTime.createTime | formatDateTime}}</span>
            </template>
            <template slot="loginTime" slot-scope="loginTime">
                <span>{{loginTime.loginTime | formatDateTime}}</span>
            </template>
            <template slot="status" slot-scope="status">
                <a-switch v-model="status.status" @change="handleStatusChange(status)"/>
            </template>
            <template slot="action" slot-scope="action">
                <a-button type="link" @click="handleSelectRole(action)">分配角色</a-button>
                <a-button type="link" @click="handleUpdateUser(action)">编辑</a-button>
                <a-button type="link" @click="handleDeleteUser(action)">删除</a-button>
            </template>
        </a-table>
        <!-- 设置排序的模态框开始 -->
        <a-modal v-model="userDialogVisible" :title="defaultDialogtitle" @ok="handleAddUserOk" >
            <a-form-model :model="user" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" ref="userForm">
                <a-form-model-item label="账号" prop="username">
                    <a-input v-model="user.username"/>
                </a-form-model-item>
                <a-form-model-item label="姓名" prop="nickName">
                    <a-input v-model="user.nickName"/>
                </a-form-model-item>
                <a-form-model-item label="邮箱" prop="email">
                    <a-input v-model="user.email"/>
                </a-form-model-item>
                <a-form-model-item label="密码" prop="password">
                    <a-input v-model="user.password" type="password"/>
                </a-form-model-item>
                <a-form-model-item label="备注" prop="note">
                    <a-input v-model="user.note" type="textarea" :rows="5"/>
                </a-form-model-item>
                <a-form-model-item label="是否取用" prop="status">
                    <a-radio-group v-model="user.status">
                        <a-radio  :value="1">是</a-radio>
                        <a-radio  :value="0">否</a-radio>
                    </a-radio-group>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
        <!-- 设置排序的模态框结束 -->
        <!-- 分配角色模态框开始 -->
        <a-modal v-model="roleDialogVisible" title="分配角色" width="400px" @ok="handleAllocConfirm">
            <a-select showArrow v-model="allocRoleIds" option-label-prop="label" mode="multiple" style="width: 350px" placeholder="请选择">
                <a-select-option v-for="option in allRoleList" :key="option.id" :value="option.id" :label="option.name">
                    {{option.name}}
                </a-select-option>
            </a-select>
        </a-modal>
        <!-- 分配角色模态框结束 -->
    </div>
</template>

<script>
import { getUsersList, updateUser, addUser, deleteUser, updateStatus, getRoleByUserId } from '@/api/user'
import { getAllRoleList, allocRole } from '@/api/role'
import { formatDate } from '@/utils/date';
const userColumns = [
     {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: '账号',
        key: 'username',
        dataIndex: 'username',
        align: 'center'
    },
    {
        title: '姓名',
        dataIndex: 'nickName',
        key: 'nickName',
        align: 'center'
    },
    {
        title: '邮箱',
        key: 'email',
        dataIndex: 'email',
        align: 'center'
    },
    {
        title: '添加时间',
        scopedSlots: { customRender: 'createTime' },
        key: 'createTime',
        align: 'center'
    },
    {
        title: '最后登录',
        scopedSlots: { customRender: 'loginTime' },
        key: 'loginTime',
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
let defaultUser = {
    id: undefined,
    username: undefined,
    password: undefined,
    nickName: undefined,
    email: undefined,
    note: undefined,
    status: 1
}
    export default {
        data() {
            return {
                //用户表格列
                columns: userColumns,
                //查询参数
                listQuery: Object.assign({}, defaultListQuery),
                //用户数据
                user: Object.assign({}, defaultUser),
                //用户列表
                userList: [],
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
                        this.getUserListData()
                    },
                    onShowSizeChange: (current, pageSize) => {
                        this.pagination.pageNum = current;
                        this.pagination.pageSize = pageSize;
                        this.getUserListData()
                    }
                },
                defaultDialogtitle: '添加用户',
                //设置排序模态框
                userDialogVisible: false,
                //表单校验规则
                rules: {
                    username: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' },
                        { min: 2, max: 8, message: '用户名需要2-8个字符', trigger: 'blur' },
                    ],
                    nickName: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' },
                    ],
                    email: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' },
                    ]
                },
                //Model是否为编辑状态,默认是false
                isEdit: false,
                //分配角色模态框
                roleDialogVisible: false,
                //分配角色列表
                allRoleList: [],
                //选择的角色id
                allocRoleIds: [],
                //分配角色的管理员
                allocAdminId: null
            }
        },
        created() {
            // 获取用户列表
            this.getUserListData();
            //获取角色列表
            this.getAllRoleListData()
        },
        computed: {},
        filters:{
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
            //获取用户列表
            async getUserListData() {
                this.loading = true;
                this.userList = [];
                const { pageNum, pageSize } = this.pagination;
                const params = Object.assign({}, this.listQuery, {pageNum, pageSize})
                const res = await getUsersList(params);
                const { list, total } = res.data.data;
                console.log(res)
                this.pagination.total = total;
                list.map(item => {
                    this.userList.push({
                        key: item.id,
                        id: item.id,
                        username: item.username,
                        nickName: item.nickName,
                        email: item.email,
                        createTime: item.createTime,
                        loginTime: item.loginTime,
                        status: !!item.status,
                        password: item.password
                    })
                })
                this.loading = false;
            },
            //处理打开模态框设置完成并确定后的函数
            handleAddUserOk(){
                const _self = this;
                this.$confirm({
                    title: '提示',
                    content: this.isEdit ? '是否确定修改?' : '是否确定添加?',
                    onOk() {
                        // 如果是编辑用户
                        if(_self.isEdit) {
                            _self.$refs.userForm.validate(valid => {
                                if(valid) {
                                    let { status } = _self.user;
                                    status = status ? 1 : 0;
                                    _self.user = Object.assign({},_self.user, {status: status});
                                    updateUser(_self.user.id, _self.user).then(res => {
                                        _self.$message.success(res.data.message);
                                        _self.getUserListData();
                                    }).catch(error => {
                                        _self.$message.error(error.message);
                                    })
                                    _self.userDialogVisible = false;
                                } else {
                                    return false;
                                }
                            })
                        } else {
                            //添加用户
                             _self.$refs.userForm.validate(valid => {
                                if(valid) {
                                    addUser(_self.user).then(res => {
                                        _self.$message.success(res.message);
                                        _self.getUserListData();
                                    }).catch(error => {
                                        _self.$message.error(error.message);
                                    })
                                    _self.userDialogVisible = false;
                                } else {
                                    return false;
                                }
                            })
                        }
                    }
                })
            },
            //删除某个用户
            handleDeleteUser(row) {
                const _self = this;
                this.$confirm({
                    title: '提示',
                    content: '是否要删除该用户?',
                    onOk(){
                        deleteUser(row.id).then(res => {
                            _self.$message.success(res.message)
                            _self.getUserListData()
                        }).catch(error => {
                            _self.$message.error(error.message)
                        })
                    }
                })
            },
            //编辑用户信息
            handleUpdateUser(row) {
                this.userDialogVisible = true;
                this.defaultDialogtitle = '编辑用户';
                this.$nextTick(() => {
                    this.$refs.userForm.resetFields();
                    let { status } = row;
                    status = status ? 1 : 0;
                    this.user = Object.assign({},row, {status: status});
                    this.isEdit = true;
                })
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
                        _self.getUserListData()
                    }
                })
            },
            //添加用户的处理函数
            handleAddUser() {
                this.userDialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.userForm.resetFields();
                    this.isEdit = false;
                })
            },
            //获取角色列表数据
            async getAllRoleListData() {
                const res = await getAllRoleList();
                this.allRoleList = res.data.data;
            },
            //分配角色
            handleSelectRole(row){
                this.allocAdminId = row.id;
                this.roleDialogVisible = true;
                this.allocRoleIds = [];
                this.getRoleListByUserId(row.id);
            },
            //根据用户id获取角色
            async getRoleListByUserId(id) {
                const res = await getRoleByUserId(id);
                let allocRoleList = res.data.data;
                if(allocRoleList && allocRoleList.length) {
                    for(let role of allocRoleList){
                        this.allocRoleIds.push(role.id)
                    }
                }
                
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
            }
        },
    }
</script>

<style lang="less" scoped>
.admin-list {
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