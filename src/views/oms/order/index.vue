<template>
    <div class="order-list">
        <a-card>
            <span slot="title">
                <a-icon type="search" />
                <span>筛选搜索</span>
            </span>
            <a-form-model class="ant-advanced-search-form" :model="listQuery" ref="form">
                <a-row :gutter="24">
                    <a-col :span="8">
                        <a-form-model-item label="输入搜索" prop="orderSn">
                            <a-input placeholder="订单编号" v-model="listQuery.orderSn"/>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="收货人" prop="receiverKeyword">
                            <a-input placeholder="收货人姓名/手机号" v-model="listQuery.receiverKeyword"/>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="提交时间" prop="createTime">
                            <a-date-picker placeholder="请选择时间" v-model="listQuery.createTime" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="订单状态" prop="status">
                            <a-select v-model="listQuery.status" allowClear placeholder="全部" style="width: 171px">
                                <a-select-option v-for="option in orderStatusOptions" :vlaue="option.value" :key="option.value" >
                                    {{option.label}}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="订单分类" prop="orderType">
                            <a-select v-model="listQuery.orderType" allowClear placeholder="全部" style="width: 171px">
                                <a-select-option v-for="option in orderTypeOptions" :vlaue="option.label" :key="option.value" >
                                    {{option.label}}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="订单来源" prop="sourceType">
                            <a-select v-model="listQuery.sourceType" allowClear placeholder="全部" style="width: 171px">
                                <a-select-option v-for="option in sourceTypeOptions" :vlaue="option.label" :key="option.value" >
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
            :data-source="orderList" 
            bordered 
            align="center" 
            :row-selection="rowSelection"
            :loading="loading"
            :pagination="pagination"
        >
            <template slot="createTime" slot-scope="createTime">
                <span>{{createTime.createTime | formatCreateTime}}</span>
            </template>
            <template slot="totalAmount" slot-scope="totalAmount">
                <span>￥{{totalAmount.totalAmount}}</span>
            </template>
            <template slot="payType" slot-scope="payType">
                <span>{{payType.payType | formatPayType}}</span>
            </template>
            <template slot="sourceType" slot-scope="sourceType">
                <span>{{sourceType.sourceType | formatSourceType}}</span>
            </template>
            <template slot="orderType" slot-scope="orderType">
                <span>{{orderType.status | formatOrderStatus}}</span>
            </template>
            <template slot="action" slot-scope="action">
                <p><a-button @click="handleShowOrder(action)">查看订单</a-button></p>
                <p v-show="action.status === 0"><a-button @click="handleCloseOrder(action)">订单发货</a-button></p>
                <p v-show="action.status === 1"><a-button @click="handleDeliveryOrder(action)">订单发货</a-button></p>
                <p v-show="action.status === 2 || action.status === 3"><a-button @click="handleViewLogistics(action)">订单跟踪</a-button></p>
                <p v-show="action.status === 4"><a-button type="danger" @click="handleDeleteOrder(action)">删除订单</a-button></p>
            </template>
        </a-table>
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
        <logistics-dialog v-model="logisticsDialogVisible" @cancel="handleLogisticsDialogVisible"/>
        <a-modal 
            title="关闭订单"
            v-model="closeOrderDialogVisible"
            @ok="handleCloseOrderConfirm"
        >
            <span style="vertical-align: top">操作备注：</span>
            <a-input type="textarea" :rows="5" placeholder="请输入内容" v-model="closeOrder.content"/>
        </a-modal>
    </div>
</template>

<script>
import { formatDate } from '@/utils/date'
import { 
    getOrderList,
    deleteOrder,
    closeOrder
} from '@/api/order'
import logisticsDialog from './components/logisticsDialog'
const orderColumns = [
     {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: '订单编号',
        key: 'orderSn',
        dataIndex: 'orderSn',
        align: 'center'
    },
    {
        title: '提交时间',
        key: 'createTime',
        scopedSlots: { customRender: 'createTime' },
        align: 'center'
    },
    {
        title: '用户账号',
        dataIndex: 'memberUsername',
        key: 'memberUsername',
        width: '130px',
        align: 'center'
    },
    {
        title: '订单金额',
        key: 'totalAmount',
        scopedSlots: { customRender: 'totalAmount' },
        width: '120px',
        align: 'center'
    },
    {
        title: '支付方式',
        scopedSlots: { customRender: 'payType' },
        key: 'payType',
        align: 'center'
    },
    {
        title: '订单来源',
        key: 'sourceType',
        scopedSlots: { customRender: 'sourceType' },
        width: '100px',
        align: 'center'
    },
    {
        title: '订单状态',
        scopedSlots: { customRender: 'orderType' },
        key: 'orderType',
        align: 'center'
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
        align: 'center'
    }
]
const orderOperateOptions = [
        {
            label: "批量发货",
            value: 1
        },
        {
            label: "关闭订单",
            value: 2
        },
        {
            label: "删除订单",
            value: 3
        }
    ]

const sourceTypeOptions = [
        {
            label: 'PC订单',
            value: 0
        },
        {
            label: 'APP订单',
            value: 1
        }
    ]
const orderTypeOptions = [
        {
            label: '正常订单',
            value: 0
        },
        {
            label: '秒杀订单',
            value: 1
        }
    ]    
const defaultListQuery = {
    orderSn: undefined,
    receiverKeyword: undefined,
    status: undefined,
    orderType: undefined,
    sourceType: undefined,
    createTime: undefined,
}

const orderStatusOptions = [
    {
        label: '待付款',
        value: 0
    },
    {
        label: '待发货',
        value: 1
    },
    {
        label: '已发货',
        value: 2
    },
    {
        label: '已完成',
        value: 3
    },
    {
        label: '已关闭',
        value: 4
    }
]
    export default {
        data() {
            return {
                columns: orderColumns,
                listQuery: Object.assign({}, defaultListQuery),
                //订单列表
                orderList: [],
                //订单分类选项
                orderTypeOptions: orderTypeOptions,
                //订单来源选项
                sourceTypeOptions: sourceTypeOptions,
                loading: false,
                //批量操作选项
                operates: orderOperateOptions,
                //订单状态选项
                orderStatusOptions: orderStatusOptions,
                operateType: undefined,
                closeOrder: {
                    content: '',
                    orderIds:[]
                },
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
                        this.getOrderListData()
                    },
                    onShowSizeChange: (current, pageSize) => {
                        this.pagination.pageNum = current;
                        this.pagination.pageSize = pageSize;
                        this.getOrderListData()
                    }
                },
                //订单跟踪的模态框状态
                logisticsDialogVisible: false,
                closeOrderDialogVisible: false
            }
        },
        components: {
            logisticsDialog
        },
        created() {
            this.getOrderListData()
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
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
            },
            //处理支付方式
            formatPayType(value){
                switch(value) {
                    case 1:
                        return '支付宝';
                    case 2:  
                        return '微信';
                    default:  
                        return '未支付'  
                }       
            },
            //处理订单来源
            formatSourceType(value){
                return value === 1 ? 'APP订单' : 'PC订单'
            },
            //处理订单状态
            formatOrderStatus(value) {
                switch(value) {
                    case 1:
                        return '待发货';
                    case 2:  
                        return '已发货';
                    case 3:
                        return '已完成';
                    case 4:   
                        return '已关闭';
                    case 5: 
                        return '无效订单';
                    default: 
                        return '待付款'   
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
            //处理订单发货
            handleDeliveryOrder(row) {
                let listItem = this.covertOrder(row);
                this.$router.push({path: '/oms/deliverOrderList', query:{list:[listItem]}})
            },
            //封装删除订单的方法
            deleteOrderById(ids) {
                const self = this;
                this.$confirm({
                    title: '提示',
                    content: '确认删除此订单?',
                    onOk(){
                        let params = new URLSearchParams();
                        params.append("ids",ids);
                        deleteOrder(params).then(res => {
                            self.$message.success(res.message)
                            //删除成功之后重新获取订单列表
                            this.getOrderList();
                        }).catch(error => {
                            self.$message.error(error.message)
                        })
                    },
                    onCancel() {}
                })
            },
            //处理删除某订单
            handleDeleteOrder(row) {
                let ids=[];
                ids.push(row.id);
                this.deleteOrderById(ids);
            },
            //转换订单参数
            covertOrder(order) {
                let address=order.receiverProvince+order.receiverCity+order.receiverRegion+order.receiverDetailAddress;
                let listItem={
                        orderId:order.id,
                        orderSn:order.orderSn,
                        receiverName:order.receiverName,
                        receiverPhone:order.receiverPhone,
                        receiverPostCode:order.receiverPostCode,
                        address:address,
                        deliveryCompany:null,
                        deliverySn:null
                    };
                    return listItem;
            },
            //点击订单跟踪
            handleViewLogistics(row) {
                console.log(row);
                this.logisticsDialogVisible = true;
            },
            //关闭订单跟踪模态框
            handleLogisticsDialogVisible() {
                this.logisticsDialogVisible = false;
            },
            //查看订单
            handleShowOrder(row) {
                this.$router.push({path:'/oms/orderDetail',query:{id:row.id}})
            },
            //获取订单列表
            async getOrderListData() {
                this.loading = true;
                this.orderList = [];
                const {pageNum, pageSize} = this.pagination;
                const params = Object.assign({}, this.listQuery, {pageNum, pageSize})
                console.log(params);
                const res = await getOrderList(params);
                const { list, total } = res.data.data;
                this.pagination.total = total;
                list.map(item => {
                    this.orderList.push({
                        key: item.id,
                        id: item.id,
                        orderSn: item.orderSn,
                        totalAmount: item.totalAmount,
                        createTime: item.createTime,
                        memberUsername: item.memberUsername,
                        payType: item.payType,
                        status: item.status,
                        sourceType: item.sourceType,
                        orderType: item.orderType,
                        receiverProvince: item.receiverProvince,
                        receiverCity: item.receiverCity,
                        receiverRegion: item.receiverRegion,
                        receiverDetailAddress: item.receiverDetailAddress,
                        receiverName: item.receiverName,
                        receiverPhone: item.receiverPhone,
                        receiverPostCode: item.receiverPostCode
                    })
                })
                this.loading = false;
            },
            //批量操作
            handleBatchOperate() {
                if(!this.operateType) {
                    this.$message.warning('请选择要操作的类型', 1)
                    return;
                }
                if(this.multipleSelection === null || this.multipleSelection.length < 1) {
                    this.$message.warning('请选择要操作的订单', 1)
                    return;
                }
                if(this.operateType === 1) {
                    //批量发货
                    let list = [];
                    for(let item of this.multipleSelection){
                        if(item.status === 1) {
                            list.push(this.covertOrder(item))
                        }
                    }
                    if(list.length === 0){
                        this.$message.warning('选中订单中没有可以发货的订单')
                        return;
                    }
                    this.$router.push({path:'/oms/deliverOrderList',query:{list:list}})
                } else if(this.operateType === 2) {
                    //关闭订单
                    this.closeOrder.orderIds = [];
                    for(let item of this.multipleSelection) {
                        //只能关闭已完成状态的
                        if(item.status === 3) {
                            this.closeOrder.orderIds.push(item.id)
                        } else {
                            this.$message.warning('选中的订单目前不可以关闭或已关闭')
                            return;
                        }
                        this.closeOrderDialogVisible = true;
                    }
                } else if(this.operateType === 3) {
                    //删除订单
                    let ids=[];
                    for(let item of this.multipleSelection){
                        //只能删除已完成、已关闭、无效订单
                        if(item.status === 1 || item.status === 2 || item.status === 0) {
                            this.$message.warning('选中的订单暂不可以删除');
                            return;
                        }
                        ids.push(item.id);
                    }
                    this.deleteOrderById(ids)
                }
            },
            //处理确认关闭订单
            handleCloseOrderConfirm() {
                if(this.closeOrder.content == null || this.closeOrder.content == ''){
                    this.$message.warning('操作备注不能为空')
                    return;
                }
                let params = new URLSearchParams();
                params.append('ids', this.closeOrder.orderIds);
                params.append('note', this.closeOrder.content);
                closeOrder(params).then(res => {
                    this.closeOrder.orderIds=[];
                    this.getOrderListData();
                    this.$message.success(res.message)
                    //清空输入框
                    this.closeOrder.content = '';
                }).catch(error => {
                    this.$message.error(error.message);
                })
                this.closeOrderDialogVisible = false;
            }
        },
    }
</script>

<style lang="less" scoped>
.order-list {
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