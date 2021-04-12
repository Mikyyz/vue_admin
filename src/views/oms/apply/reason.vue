<template>
    <div class="returnorder-reason">
        <a-card class="operate-container">
            <span slot="title">
                <a-icon type="file-text" theme="filled" />
                <span>列表数据</span>
            </span>
            <a-button slot="extra" @click="handleAdd">添加</a-button>
        </a-card>
        <a-table 
            :data-source="returnReasonList"
            :columns="returnReasonColums" 
            :loading="loading"
            bordered
            :row-selection="rowSelection"
            :pagination="pagination"
        >
            <template slot="status" slot-scope="status">
                <a-switch v-model="status.status" @change="handleUpdateOrderReasonStatus(status)" />
            </template>
            <template slot="createTime" slot-scope="createTime">
                {{createTime.createTime | formatCreateTime}}
            </template>
            <template slot="action" slot-scope="action">
                <a-button type="primary" @click="updateReturnReason(action)">编辑</a-button>
                <a-button type="danger" style="margin-left: 10px" @click="handleReturnReason(action)">删除</a-button>
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
        <a-modal  
            :title="defaultModalTitle"
            v-model="visible"
            @ok="handleConfirm"
            @cancel="handleCancel"
        >
            <a-form-model 
               :model="returnReason"
               ref="reasonForm"
            >
                <a-form-model-item label="原因类型" v-bind="formItemStyle">
                    <a-input v-model="returnReason.name" class="input-width"></a-input>
                </a-form-model-item>
                <a-form-model-item label="排序" v-bind="formItemStyle">
                    <a-input v-model="returnReason.sort" class="input-width"></a-input>
                </a-form-model-item>
                <a-form-model-item label="是否启用" v-bind="formItemStyle">
                    <a-switch v-model="returnReason.status"></a-switch>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import { formatDate } from '@/utils/date'
import { 
    getReturnOrderReasonList, 
    getReturnReasonDeatil, 
    addReturnReason,
    updateReturnReason,
    updateOrderReasonStatus,
    deleteOrderReturn
} from '@/api/order'
const returnReasonColums = [
     {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: '原因类型',
        key: 'name',
        dataIndex: 'name',
        align: 'center'
    },
    {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
        align: 'center'
    },
    {
        title: '是否可用',
        key: 'status',
        scopedSlots: { customRender: 'status' },
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
//默认的退货原因配置对象
const defaultReturnReason = {
    name:null,
    sort:0,
    status:true,
    createTime:null
  };
    export default {
        data() {
            return {
                visible: false,
                loading: false,
                returnReason: Object.assign({}, defaultReturnReason),
                returnReasonColums: returnReasonColums,
                returnReasonList: [],
                //多项选择
                multipleSelection: [],
                //分页配置
                pagination: {
                    total: 0,
                    pageNum: 1,//第几页
                    pageSize: 5,//每页显示多少条数据
                    showSizeChanger: true, //是否可以改变 pageSize
                    pageSizeOptions: ["5", "10", "15"],//每页中显示的数据
                    showTotal: total => `共有 ${total} 条数据`, //分页中显示的数据,
                    onChange: pageNum => {
                        this.pagination.pageNum = pageNum;
                        this.getReturnOrderReasonData()
                    },
                    onShowSizeChange: (current, pageSize) => {
                        this.pagination.pageNum = current;
                        this.pagination.pageSize = pageSize;
                        this.getReturnOrderReasonData()
                    }
                },
                //批量操作的默认选项值
                operateType:undefined,
                //批量操作选项操作
                operateOptions: [
                    {
                        label: "删除",
                        value: 1
                    }
                ],
                formItemStyle: {
                    labelCol: {
                        span: 8
                    },
                    wrapperCol: {
                        span: 12
                    }
                },
                operateReasonId: null,
                defaultModalTitle: '添加退货原因'
            }
        },
        filters: {
                //格式化时间
                formatCreateTime(time) {
                    let date = new Date(time);
                    return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
                },
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
        created() {
            this.getReturnOrderReasonData();
        },
        methods: {
            //添加退货原因
            handleAdd() {
                this.visible = true;
                this.operateReasonId=null;
            },
            //确认添加/更新退货原因
            handleConfirm() {
                //对传输的参数做处理
                let { status } = this.returnReason
                status = status ? 1 : 0;
                const params=Object.assign({},{...this.returnReason}, {status});
                if(this.defaultModalTitle === '添加退货原因') {
                    //添加操作
                    addReturnReason(params).then(res => {
                        this.$message.success(res.message)
                    }).catch(error => {
                        this.$message.error(error.message)
                    })
                } else {
                    //更新操作
                    updateReturnReason(params, this.operateReasonId).then(res => {
                        this.$message.success(res.message)
                    }).catch(error => {
                        this.$message.error(error.message)
                    })
                    this.visible = false;
                    this.returnReason.name = ''
                }
            },
            //更新退货原因
            async updateReturnReason(row) {
                this.visible = true;
                this.defaultModalTitle = '编辑退货原因';
                this.operateReasonId = row.id;
                const res = await getReturnReasonDeatil(row.id);
                let { name, sort, status, createTime } = res.data.data;
                this.returnReason = Object.assign({},{name, sort, createTime}, {status: !!status})
            },
            //点击关闭模态框
            handleCancel() {
                this.returnReason.name = ''
            },
            //处理删除操作
            handleReturnReason(row) {
                let ids=[];
                ids.push(row.id);
                this.deleteReason(ids);
            },
            //封装删除某项退货原因方法
            deleteReason(ids) {
                const _self = this;
                this.$confirm({
                    title: '提示',
                    content: '是否要进行该删除操作?',
                    onOk() {
                        let params = new URLSearchParams();
                        params.append("ids",ids);
                        deleteOrderReturn(params).then(res => {
                             _self.$message.success(res.message);
                             //重新获取列表
                            this.getReturnOrderReasonData()
                        }).catch(error => {
                             _self.$message.error(error.message)
                        })
                    },
                    onCancel(){}
                })
            },
            //获取退货原因数据列表
            async getReturnOrderReasonData() {
                this.returnReasonList = []
                this.loading = true;
                const { pageSize, pageNum } = this.pagination;
                const res = await getReturnOrderReasonList({pageNum, pageSize})
                const { list, total } = res.data.data;
                console.log(list)
                this.pagination.total = total;
                list.map(item => {
                    this.returnReasonList.push({
                        key: item.id,
                        id: item.id,
                        name: item.name,
                        createTime: item.createTime,
                        sort: item.sort,
                        status: !!item.status
                    })
                });
                this.loading = false;
            },
            //更改是否可用状态
            handleUpdateOrderReasonStatus(row) {
                let ids=[];
                ids.push(row.id);
                let param = new URLSearchParams();
                param.append("status",Number(row.status));
                param.append("ids",ids);
                updateOrderReasonStatus(param).then(res => {
                    this.$message.success(res.message)
                }).catch(error => {
                    this.$message.error(error.message)
                })
                //是否更新成功都要刷新列表
                this.getReturnOrderReasonData();
            },
            //批量操作
            handleBatchOperate(){
                if(this.operateType !== 1) {
                    this.$message.warning('请选择要操作的类型', 1)
                    return;
                }
                if(this.multipleSelection === null || this.multipleSelection.length < 1) {
                    this.$message.warning('请选择要操作的订单', 1)
                    return;
                }
                if(this.operateType === 1) {
                    let ids=[];
                    for(let item of this.multipleSelection) {
                        ids.push(item.id)
                    }
                    this.deleteReason(ids);
                }
            }
        },
    }
</script>

<style lang="less" scoped>
.returnorder-reason {
    margin: 10px;
    .operate-container {
        margin-bottom: 10px;
    }
    .batch-operate-container {
        margin-top: -48px;
    }
}
</style>