<template>
    <div class="flash-list">
        <a-card>
            <span slot="title">
                <a-icon type="search" />
                <span>筛选搜索</span>
            </span>
            <a-form-model class="ant-advanced-search-form" :model="listQuery" ref="form">
                <a-row :gutter="24">
                    <a-col :span="8">
                        <a-form-model-item label="活动名称" prop="keyword">
                            <a-input placeholder="活动名称" v-model="listQuery.keyword"/>
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
                <a-button style="margin-right: 20px" @click="handleShowSessionList()">秒杀时间段列表</a-button>
                <a-button @click="handleAddActive">活动添加</a-button>
            </div>
        </a-card>
        <a-table 
            :columns="columns" 
            :data-source="flashList" 
            bordered
            :row-selection="rowSelection"
            :loading="loading"
            :pagination="pagination"
        >
            <template slot="activeStatus" slot-scope="activeStatus">
                <span>{{activeStatus | formatActiveStatus}}</span>
            </template>
            <template slot="startDate" slot-scope="startDate">
                <span>{{startDate.startDate | formatCreateTime}}</span>
            </template>
            <template slot="endDate" slot-scope="endDate">
                {{endDate.endDate | formatCreateTime}}
            </template>
            <template slot="status" slot-scope="status">
                <a-switch v-model="status.status" @change="handleStatusChange(status)" />
            </template>
            <template slot="action" slot-scope="action">
                <a-button type="link" @click="handleSelectSession(action)">设置商品</a-button>
                <a-button type="link" @click="handleUpdate(action)">编辑</a-button>
                <a-button type="link" @click="handleDelete(action)">删除</a-button>
            </template>
        </a-table>
        <a-modal  
            :title="defaultModalTitle"
            v-model="visible"
            @ok="handleConfirm"
            @cancel="handleCancel"
        >
            <a-form-model 
               :model="flashPromotion"
               ref="flashForm"
            >
                <a-form-model-item label="活动标题" v-bind="formItemStyle">
                    <a-input v-model="flashPromotion.title" placeholder="请输入活动名称" />
                </a-form-model-item>
                <a-form-model-item label="开始时间" v-bind="formItemStyle">
                    <a-date-picker
                        format="YYYY-MM-DD"
                        placeholder="请选择活动开始时间"
                        :disabled-date="disabledDate"
                        show-time
                        v-model="flashPromotion.startDate"
                    />
                </a-form-model-item>
                <a-form-model-item label="结束时间" v-bind="formItemStyle">
                    <a-date-picker
                        format="YYYY-MM-DD"
                        placeholder="请选择活动结束时间"
                        :disabled-date="disabledDate"
                        show-time
                        v-model="flashPromotion.endDate"
                    />
                </a-form-model-item>
                <a-form-model-item label="上线/下线" v-bind="formItemStyle">
                    <a-radio-group v-model="flashPromotion.status">
                        <a-radio :value="true">上线</a-radio>
                        <a-radio :value="false">下线</a-radio>
                    </a-radio-group>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import moment from 'moment';
import { formatDate } from '@/utils/date'
import {
    getFlashList,
    deleteFlashById,
    updateFlash,
    updateStatus
} from '@/api/flash'
const flashColumns = [
     {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: '活动标题',
        key: 'title',
        dataIndex: 'title',
        align: 'center'
    },
    {
        title: '活动状态',
        scopedSlots: { customRender: 'activeStatus' },
        key: 'activeStatus',
        align: 'center'
    },
    {
        title: '开始时间',
        key: 'startDate',
        scopedSlots: { customRender: 'startDate' },
        align: 'center'
    },
    {
        title: '结束时间',
        scopedSlots: { customRender: 'endDate' },
        key: 'endDate',
        align: 'center'
    },
    {
        title: '上线/下线',
        key: 'status',
        scopedSlots: { customRender: 'status' },
        align: 'center'
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
        align: 'center'
    }
]
const defaultListQuery = {
    keyword: undefined
}
//初始的活动配置对象
const defaultFlashPromotion = {
    id: undefined,
    title: undefined,
    startDate: undefined,
    endDate: undefined,
    status: true
}
    export default {
        data() {
            return {
                //表格列
                columns: flashColumns,
                //查询参数
                listQuery: Object.assign({}, defaultListQuery),
                //活动对象
                flashPromotion: Object.assign({}, defaultFlashPromotion),
                //秒杀活动列表
                flashList: [],
                //表格加载数据loading
                loading: false,
                //多选选项
                multipleSelection: [],
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
                        this.getFlashListData()
                    },
                    onShowSizeChange: (current, pageSize) => {
                        this.pagination.pageNum = current;
                        this.pagination.pageSize = pageSize;
                        this.getFlashListData()
                    }
                },
                //模态框中的表单样式
                formItemStyle: {
                    labelCol: {
                        span: 8
                    },
                    wrapperCol: {
                        span: 12
                    }
                },
                //模态框显隐状态
                visible: false,
                defaultModalTitle: '活动添加'
            }
        },
        created() {
            this.getFlashListData()
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
            //格式化时间
            formatCreateTime(time) {
                if(time==null||time===''){
                    return 'N/A';
                }
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd')
            },
            //处理活动状态
            formatActiveStatus(row){
                let nowTime = new Date().getTime();
                if(nowTime >= row.startDate && nowTime <= row.endDate) {
                    return '活动进行中'
                } else if(nowTime > row.endDate) {
                    return '活动已结束'
                } else {
                    return '活动未开始'
                }
            }
        },
        methods: {
            //重置表单项
            handleResetSearch(){
                this.$refs.form.resetFields();
            },
            //搜索查询
            handleSearchList() {
                //重置pageNum为1
                this.pagination.pageNum = 1;
                this.getFlashListData();
            },
            //获取秒杀活动列表
            async getFlashListData() {
                this.loading = true;
                this.flashList = [];
                const { pageNum, pageSize } = this.pagination;
                const params = Object.assign({}, this.listQuery, {pageNum, pageSize})
                const res = await getFlashList(params);
                const { list, total } = res.data.data;
                this.pagination.total = total;
                list.map(item => {
                    this.flashList.push({
                        key: item.id,
                        id: item.id,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        status: !!item.status,
                        title: item.title
                    })
                })
                console.log(this.flashList)
                this.loading = false;
            },
            //处理不可用日期范围
            disabledDate(current){
                return current && current + 1 < moment().endOf('day');
            },
            //更改上线/下线的状态
            handleStatusChange(row) {
                const _self = this;
                this.$confirm({
                    title: '提示',
                    content: '是否要修改该状态?',
                    onOk(){
                        updateStatus(row.id, {status: row.status ? 1 : 0}).then(res => {
                            _self.$message.success(res.message)
                            _self.getFlashListData();
                        }).catch(error => {
                            _self.$message.error(error.message)
                        })
                    }
                })
            },
            //处理设置商品
            handleSelectSession(row){
                this.$router.push({path:'/sms/selectSession', query:{flashPromotionId:row.id}})
            },
            //处理添加活动
            handleAddActive(){
                this.visible = true;
                let { status } = this.flashPromotion;
                status = status ? 1 : 0;
                const param = Object.assign({}, this.flashPromotion, {status})
                console.log(param)
            },
            //处理确认添加活动
            handleConfirm(){
                if(this.defaultModalTitle === '活动添加') {
                    this.handleAddActive();
                } else {
                    let { status, id } = this.flashPromotion
                    status = status ? 1: 0;
                    const param = Object.assign({}, {...this.flashPromotion}, {status})
                    updateFlash(id, param).then(res => {
                        this.$message.success(res.message);
                        this.getFlashListData();
                    }).catch(error => {
                        this.$message.error(error.message);
                    })
                    this.visible = false;
                }
            },
            //删除某项活动
            handleDelete(row){
                const _self = this;
                this.$confirm({
                    title: '提示',
                    content: '是否要删除该活动?',
                    onOk() {
                        deleteFlashById(row.id).then(res => {
                            _self.$message.success(res.message);
                            _self.getFlashListData()
                        }).catch(error => {
                            _self.$message.error(error.message);
                        })
                    }
                })
            },
            //更新某项活动
            handleUpdate(row){
                this.visible = true;
                this.defaultModalTitle = '活动编辑'
                console.log(row);
            },
            //关闭模态框后
            handleCancel(){
                this.flashPromotion = Object.assign({}, defaultFlashPromotion);
            },
            //秒杀时间段列表
            handleShowSessionList(){
                this.$router.push({path: '/sms/flashSession'})
            }
        },
    }
</script>

<style lang="less" scoped>
.flash-list {
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