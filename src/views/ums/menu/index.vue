<template>
    <div class="menu-list">
        <a-card class="operate-container">
            <span slot="title">
                <a-icon type="file-text" theme="filled" />
                <span>列表数据</span>
            </span>
            <div slot="extra">
                <a-button @click="handleAddMenu">添加菜单</a-button>
            </div>
        </a-card>
        <a-table 
            :columns="columns" 
            :data-source="menuList" 
            bordered
            :loading="loading"
            :pagination="pagination"
        >
            <template slot="level" slot-scope="level">
                <span>{{level.level | formatLevel}}</span>
            </template>
            <template slot="icon" slot-scope="icon">
                <svg-icon :icon-class="icon.icon"></svg-icon>
            </template>
            <template slot="hidden" slot-scope="hidden">
                <a-switch v-model="hidden.hidden" @change="handleStatusChange(hidden)"/>
            </template>
            <template slot="setting" slot-scope="setting">
                <a-button type="link" :disabled="setting.level | disableNextLevel" @click="handleShowNextLevel(setting)">查看下级</a-button>
            </template>
            <template slot="action" slot-scope="action">
                <a-button type="link" @click="handleUpdateMenu(action)">编辑</a-button>
                <a-button type="link" @click="handleDeleteMenu(action)">删除</a-button>
            </template>
        </a-table>
    </div>
</template>

<script>
import { getMenuList, deleteMenu, settingMenuShow } from '@/api/menu'
const menuColumns = [
     {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: '菜单名称',
        key: 'title',
        dataIndex: 'title',
        align: 'center'
    },
    {
        title: '菜单级数',
        scopedSlots: { customRender: 'level' },
        key: 'level',
        align: 'center'
    },
    {
        title: '前端名称',
        key: 'name',
        dataIndex: 'name',
        align: 'center'
    },
    {
        title: '前端图标',
        scopedSlots: { customRender: 'icon' },
        key: 'icon',
        align: 'center'
    },
    {
        title: '是否显示',
        scopedSlots: { customRender: 'hidden' },
        key: 'hidden',
        align: 'center'
    },
    {
        title: '排序',
        key: 'sort',
        dataIndex: 'sort',
        align: 'center'
    },
    {
        title: '设置',
        key: 'setting',
        scopedSlots: { customRender: 'setting' },
        align: 'center'
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
        align: 'center'
    }
]
    export default {
        data() {
            return {
                //角色表格列
                columns: menuColumns,
                //菜单列表
                menuList: [],
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
                        this.getMenuListData()
                    },
                    onShowSizeChange: (current, pageSize) => {
                        this.pagination.pageNum = current;
                        this.pagination.pageSize = pageSize;
                        this.getMenuListData()
                    }
                },
                //父级的id
                parentId: 0
            }
        },
        created() {
            //获取菜单列表
            this.getMenuListData()
        },
        computed: {},
        filters:{
            //处理等级类型
            formatLevel(level) {
                return level === 0 ? '一级' : '二级';
            },
            //处理是否可以查看下级
            disableNextLevel(value) {
                return value === 0 ? false : true;
            }
        },
        watch: {
            $route() {
                this.resetParentId();
                this.getMenuListData();
            }
        },
        methods: {
            //重置ParentId
            resetParentId(){
                this.pagination.pageNum = 1;
                if(this.$route.query.parentId !== null) {
                    this.parentId = this.$route.query.parentId;
                } else {
                    this.parentId = 0;
                }
            },
            //获取角色列表
            async getMenuListData() {
                this.loading = true;
                this.menuList = [];
                const { pageNum, pageSize } = this.pagination;
                const res = await getMenuList(this.parentId, { pageNum, pageSize });
                const { list, total } = res.data.data;
                console.log(list)
                this.pagination.total = total;
                list.map(item => {
                    this.menuList.push({
                        key: item.id,
                        id: item.id,
                        name: item.name,
                        title: item.title,
                        icon: item.icon,
                        sort: item.sort,
                        level: item.level,
                        hidden: item.hidden === 0 ? true : false
                    })
                })
                this.loading = false;
            },
            //更新是否显示菜单
            handleStatusChange(row){
                const _self = this;
                this.$confirm({
                    title: '提示',
                    content: '是否要修改该状态?',
                    onOk(){
                        //处理需要发送给后台的数据(推荐状态)
                        let hidden = row.hidden ? 0 : 1;
                        settingMenuShow(row.id, {hidden: hidden}).then(res => {
                            _self.$message.success(res.message)
                        }).catch(error => {
                            _self.$message.error(error.message)
                        })
                        _self.getMenuListData()
                    }
                })
            },
            //添加菜单的处理函数
            handleAddMenu() {
                this.$router.push('/ums/addMenu');
            },
            //处理查看下级
            handleShowNextLevel(row){
                this.$router.push({path: '/ums/menu', query: {parentId: row.id}})
            },
            //编辑菜单
            handleUpdateMenu(row) {
                this.$router.push({path:'/ums/updateMenu',query:{id:row.id}});
            },
            //删除菜单
            handleDeleteMenu(row) {
                const _self = this;
                this.$confirm({
                    title: '提示',
                    content: '是否要删除该菜单?',
                    onOk(){
                        deleteMenu(row.id).then(res => {
                            _self.$message.success(res.message)
                            _self.getMenuListData()
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
.menu-list {
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