<template>
    <div class="returnorder-list">
        <a-card>
            <span slot="title">
                <a-icon type="search" />
                <span>筛选搜索</span>
            </span>
            <a-form-model class="ant-advanced-search-form" :model="listQuery" ref="form">
                <a-row :gutter="24">
                    <a-col :span="8">
                        <a-form-model-item label="输入搜索" prop="id">
                            <a-input placeholder="服务单号" v-model="listQuery.id"/>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="处理状态" prop="status">
                            <a-select v-model="listQuery.status" allowClear placeholder="全部" style="width: 171px">
                                <a-select-option v-for="option in defaultStatusOptions" :vlaue="option.value" :key="option.value" >
                                    {{option.label}}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="申请时间" prop="createTime">
                            <a-date-picker placeholder="请选择时间" v-model="listQuery.createTime" />
                        </a-form-model-item>
                    </a-col>
                     <a-col :span="8">
                        <a-form-model-item label="操作人员" prop="handleMan">
                            <a-input placeholder="全部" v-model="listQuery.handleMan"/>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="处理时间" prop="handleTime">
                            <a-date-picker placeholder="请选择时间" v-model="listQuery.handleTime" />
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
            :data-source="returnorderList" 
            bordered 
            align="center" 
            :row-selection="rowSelection"
            :loading="loading"
            :pagination="pagination"
        >
            <template slot="createTime" slot-scope="createTime">
                <span>{{createTime.createTime | formatCreateTime}}</span>
            </template>
            <template slot="returnAmount" slot-scope="returnAmount">
                <span>￥{{returnAmount.productRealPrice}}</span>
            </template>
            <template slot="status" slot-scope="status">
                {{status.status | formatStatus}}
            </template>
            <template slot="handleTime" slot-scope="handleTime">
                {{handleTime.handleTime | formatCreateTime}}
            </template>
            <template slot="action" slot-scope="action">
                <p><a-button @click="handleShowreturnorderDetail(action)">查看详情</a-button></p>
            </template>
        </a-table>
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
import { formatDate } from '@/utils/date'
import { 
    getReturnOrderList,
    deleteReturnOrder
} from '@/api/order'
const orderColumns = [
     {
        title: '服务单号',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: '申请时间',
        key: 'createTime',
        scopedSlots: { customRender: 'createTime' },
        align: 'center'
    },
    {
        title: '用户账号',
        dataIndex: 'memberUsername',
        key: 'memberUsername',
        align: 'center'
    },
    {
        title: '退款金额',
        key: 'returnAmount',
        scopedSlots: { customRender: 'returnAmount' },
        align: 'center'
    },
    {
        title: '申请状态',
        scopedSlots: { customRender: 'status' },
        key: 'status',
        align: 'center'
    },
    {
        title: '处理时间',
        key: 'handleTime',
        scopedSlots: { customRender: 'handleTime' },
        align: 'center'
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
        align: 'center'
    }
]
const defaultStatusOptions = [
        {
            label: "待处理",
            value: 0
        },
        {
            label: "退货中",
            value: 1
        },
        {
            label: "已完成",
            value: 2
        },
        {
            label: '已拒绝',
            value: 3
        }
    ]
 
const defaultListQuery = {
    id: undefined,
    receiverKeyword: undefined,
    status: undefined,
    createTime: undefined,
    handleMan: undefined,
    handleTime: undefined
}
    export default {
        data() {
            return {
                columns: orderColumns,
                listQuery: Object.assign({}, defaultListQuery),
                //退货订单列表
                returnorderList: [],
                //订单状态选项
                defaultStatusOptions: defaultStatusOptions,
                //表格加载数据loading
                loading: false,
                operateType: undefined,
                //批量操作选项
                operateOptions: [
                    {
                        label: "批量删除",
                        value: 1
                    }
                ],
                //批量操作的选项
                multipleSelection: [],
                //订单表格分页配置项
                pagination: {
                   total: 0,
                   pageSize: 5,
                   pageNum: 1,
                   showSizeChanger: true, 
                   pageSizeOptions:['5','10','15'],
                   showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
                   onChange: pageNum => {
                        this.pagination.pageNum = pageNum;
                        this.getReturnOrderListData()
                    },
                    onShowSizeChange: (current, pageSize) => {
                        this.pagination.pageNum = current;
                        this.pagination.pageSize = pageSize;
                        this.getReturnOrderListData()
                    }
                },
                //订单跟踪的模态框状态
                logisticsDialogVisible: false,
                closeOrderDialogVisible: false
            }
        },
        created() {
            this.getReturnOrderListData()
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
        watch: {},
        filters:{
            //格式化时间
            formatCreateTime(time) {
                if(time==null||time===''){
                    return 'N/A';
                }
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
            },
            formatStatus(status){
                switch(status) {
                    case 0:
                        return '待处理';
                    case 1:
                        return '退货中';
                    case 2: 
                        return '已完成';
                    case 3:
                        return '已拒绝';
                }
            }
        },
        mounted() {},
        methods: {
            //重置表单项
            handleResetSearch(){
                this.selectProductCateValue = null;
                this.$refs.form.resetFields();
            },
            //搜索查询
            handleSearchList() {
                //重置pageNum为1
                this.pagination.pageNum = 1;
                this.getOrderListData();
            },
            //获取订单列表
            async getReturnOrderListData() {
                this.loading = true;
                this.returnorderList = [];
                const {pageNum, pageSize} = this.pagination;
                const params = Object.assign({}, this.listQuery, {pageNum, pageSize})
                const res = await getReturnOrderList(params);
                const { list, total } = res.data.data;
                this.pagination.total = total;
                list.map(item => {
                    this.returnorderList.push({
                        key: item.id,
                        id: item.id,
                        createTime: item.createTime,
                        memberUsername: item.memberUsername,
                        productRealPrice: item.productRealPrice,
                        status: item.status,
                        handleTime: item.handleTime
                    })
                })
                this.loading = false;
            },
            //批量操作
            handleBatchOperate() {
                const _self = this;
                if(this.operateType !== 1) {
                    this.$message.warning('请选择要操作的类型', 1)
                    return;
                }
                if(this.multipleSelection === null || this.multipleSelection.length < 1) {
                    this.$message.warning('请选择要操作的订单', 1)
                    return;
                }
                this.$confirm({
                    title: '提示',
                    content: '是否要进行删除操作?',
                    onOk(){
                        let params = new URLSearchParams();
                        let ids=[];
                        for(let item of _self.multipleSelection) {
                            ids.push(item.id);
                        }
                        params.append("ids",ids);
                        deleteReturnOrder(params).then(res=> {
                            _self.$message.success(res.message)
                        }).catch(error => {
                            _self.$message.error(error.message)
                        })
                    }
                })
            },
            handleShowreturnorderDetail(row){
                this.$router.push({path:'/oms/returnApplyDetail',query:{id:row.id}})
            }
        },
    }
</script>

<style lang="less" scoped>
.returnorder-list {
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