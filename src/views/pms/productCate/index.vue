<template>
    <div class="product-category">
        <a-card class="operate-container">
            <span slot="title">
                <a-icon type="file-text" theme="filled" />
                <span>列表数据</span>
            </span>
            <a-button slot="extra" @click="handleAddProductCate">添加</a-button>
        </a-card>
        <a-table 
            :columns="productCateColumns" 
            :data-source="productCateData" 
            bordered
            :loading="loading"
        >
            <template slot="level" slot-scope="level">
                <span>{{level | levelFilter}}</span>
            </template>
            <template slot="scopeNav" slot-scope="scopeNav">
                <a-switch v-model="scopeNav.navStatus" @change="handleNavStatusChange(scopeNav)"/>
            </template>
            <template slot="scopeShow" slot-scope="scopeShow">
                <a-switch v-model="scopeShow.showStatus" @change="handleShowStatusChange(scopeShow)"/>
            </template>
            <template slot="setting" slot-scope="setting">
                <a-button style="margin-bottom: 10px" :disabled="setting.level | disableNextLevel" @click="handleShowNextLevel(setting)">查看下级</a-button>
                <a-button @click="handleTransferProduct(setting)">转移商品</a-button>
            </template>
            <template slot="action" slot-scope="action">
                <a-button style="margin-right: 10px" @click="handleUpdate(action)">编辑</a-button>
                <a-button type="danger" @click="handleDelete(action)">删除</a-button>
            </template>
        </a-table>
    </div>
</template>

<script>
const productCateColumns = [
    {
        title: '编号',
        dataIndex: 'id',
        align: 'center'
    },
    {
        title: '分类名称',
        dataIndex: 'name',
        align: 'center'
    },
    {
        title: '级别',
        dataIndex: 'level',
        scopedSlots: {customRender: 'level'},
        align: 'center'
    },
    {
        title: '商品数量',
        dataIndex: 'productCount',
        align: 'center'
    },
    {
        title: '数量单位',
        dataIndex: 'productUnit',
        align: 'center'
    },
    {
        title: '导航栏',
        scopedSlots: {customRender: 'scopeNav'},
        align: 'center'
    },
    {
        title: '是否显示',
        scopedSlots: {customRender: 'scopeShow'},
        align: 'center'
    },
    {
        title: '排序',
        dataIndex: 'sort',
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
import { getProductCateList, updateNavStatus, updateShowStatus, deleteProductCate } from '@/api/product'
    export default {
        data() {
            return {
                productCateColumns: productCateColumns,
                productCateData: [],
                listQuery: {
                    pageNum: 1,
                    pageSize: 5
                },
                parentId: 0,
                loading: false
            }
        },
        created() {
            this.getProductCate();
            this.resetParentId();
        },
        watch: {
            $route() {
                this.productCateData = [];//清空一级表格数据
                this.resetParentId();
                this.getProductCate();
            }
        },
        filters: {
            levelFilter(value) {
                return value === 0 ? '一级' : '二级';
            },
            //查看下一级按钮状态
            disableNextLevel(value) {
                return value === 0 ? false : true
            }
        },
        methods: {
            //添加商品分类
            handleAddProductCate(){
                this.$router.push('/pms/addProductCate');
            },
            async getProductCate() {
                this.loading = true;
                const res = await getProductCateList(this.parentId, this.listQuery);
                    const { list } = res.data.data;
                    list.map((item) => {
                        this.productCateData.push({
                            key: item.id,
                            id: item.id,
                            name: item.name,
                            level: item.level,
                            productCount: item.productCount,
                            productUnit: item.productUnit,
                            navStatus: !!item.navStatus,
                            showStatus: !!item.showStatus,
                            sort: item.sort
                        })
                    });
                this.loading = false;
            },
            resetParentId(){
                this.listQuery.pageNum = 1;
                if (this.$route.query.parentId != null) {
                    this.parentId = this.$route.query.parentId;
                } else {
                    this.parentId = 0;
                }
            },
            //处理修改导航状态
            handleNavStatusChange(row) {
                //需要对switch的状态数据做转换,再提交给后台
                let navStatus = row.navStatus ? 1 : 0;
                let data = new URLSearchParams();
                let ids=[];
                ids.push(row.id)
                data.append('ids',ids);
                data.append('navStatus',navStatus);
                updateNavStatus(data).then(res => {
                    this.$message.success(res.message)
                    this.getProductCate();
                }).catch(error => {
                    this.getProductCate();
                    this.$message.error(error.message)
                })
            },
            //处理修改显示状态
            handleShowStatusChange(row) {
                let showStatus = row.showStatus ? 1 : 0;
                let data = new URLSearchParams();
                let ids=[];
                ids.push(row.id)
                data.append('ids',ids);
                data.append('showStatus',showStatus);
                updateShowStatus(data).then(res => {
                    this.$message.success(res.message)
                    this.getProductCate();
                }).catch(error => {
                    this.getProductCate();
                    this.$message.error(error.message)
                })
            },
            //处理查看下一级
            handleShowNextLevel(row) {
                this.$router.push({path: '/pms/productCate', query: {parentId: row.id}});
            },
            //转移商品
            handleTransferProduct(row) {
                console.log(row);
            },
            //编辑商品分类
            handleUpdate(row) {
                this.$router.push({path:'/pms/updateProductCate',query:{id:row.id}})
            },
            //删除商品分类
            handleDelete(row) {
                let self = this;
                this.$confirm({
                    title: '提示',
                    content: '是否要删除该品牌',
                    okText: '确定',
                    cancelText: '取消',
                    onOk(){
                        deleteProductCate(row.id).then(res => {
                            console.log(res);
                            self.$message.success('删除成功')
                            self.getProductCate()
                        }).catch(error => {
                            self.$message.error(error.message)
                        })
                    },
                    onCancel(){}
                })
            }
        },
    }
</script>

<style lang="less" scoped>
.product-category {
    margin: 10px;
    .operate-container {
        margin-bottom: 10px;
    }
}
</style>