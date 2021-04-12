<template>
    <div class="coupon-list">
        <a-card>
            <span slot="title">
                <a-icon type="search" />
                <span>筛选搜索</span>
            </span>
            <a-form-model class="ant-advanced-search-form" :model="listQuery" ref="form">
                <a-row :gutter="24">
                    <a-col :span="8">
                        <a-form-model-item label="优惠券名称" prop="name">
                            <a-input placeholder="优惠券名称" v-model.trim="listQuery.name"/>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="优惠券类型" prop="type">
                            <a-select v-model="listQuery.type" allowClear placeholder="全部" style="width: 171px" @change="handleSelectChange(listQuery.type)">
                                <a-select-option v-for="option in couponTypeList" :vlaue="option.value" :key="option.value" >
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
            <div slot="extra">
                <a-button @click="handleAddCoupon">添加优惠券</a-button>
            </div>
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
            <template slot="type" slot-scope="type">
                <span>{{type.type | formatCouponType}}</span>
            </template>
            <template slot="useType" slot-scope="useType">
                <span>{{useType.useType | formatUseType}}</span>
            </template>
            <template slot="minPoint" slot-scope="minPoint">
                <span>满{{minPoint.minPoint}}元可用</span>
            </template>
            <template slot="amount" slot-scope="amount">
                <span>{{amount.amount}}元</span>
            </template>
            <template slot="platform" slot-scope="platform">
                <span>{{platform.platform | formatPlatform}}</span>
            </template>
            <template slot="period" slot-scope="period">
                <span>{{period.period | formatDate}}至{{period.endTime | formatDate}}</span>
            </template>
            <template slot="endTime" slot-scope="endTime">
                <span>{{endTime.endTime | formatStatus}}</span>
            </template>
            <template slot="action" slot-scope="action">
                <a-button type="link" @click="handleView(action)">查看</a-button>
                <a-button type="link" @click="handleUpdate(action)">编辑</a-button>
                <a-button type="link" @click="handleDelete(action)">删除</a-button>
            </template>
        </a-table>
    </div>
</template>

<script>
import { formatDate } from '@/utils/date'
import {
    getCouponList,
    deleteCoupon
} from '@/api/coupon'
const couponColumns = [
     {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: '优惠券名称',
        key: 'name',
        dataIndex: 'name',
        width: '120px',
        align: 'center'
    },
    {
        title: '优惠券类型',
        scopedSlots: { customRender: 'type' },
        key: 'type',
        align: 'center'
    },
    {
        title: '使用范围',
        key: 'useType',
        scopedSlots: { customRender: 'useType' },
        align: 'center'
    },
    {
        title: '使用门槛',
        scopedSlots: { customRender: 'minPoint' },
        key: 'minPoint',
        align: 'center'
    },
    {
        title: '面值',
        key: 'amount',
        scopedSlots: { customRender: 'amount' },
        align: 'center'
    },
    {
        title: '适用平台',
        key: 'platform',
        scopedSlots: { customRender: 'platform' },
        align: 'center'
    },
    {
        title: '有效期',
        key: 'period',
        scopedSlots: { customRender: 'period' },
        width: '150px',
        align: 'center'
    },
    {
        title: '状态',
        key: 'endTime',
        scopedSlots: { customRender: 'endTime' },
        width: '100px',
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
    name: undefined,
    type: undefined
}
//默认优惠券类型
const defaultTypeOptions=[
    {
      label: '全场赠券',
      value: 0
    },
    {
      label: '会员赠券',
      value: 1
    },
    {
      label: '购物赠券',
      value: 2
    },
    {
      label: '注册赠券',
      value: 3
    }
  ];
    export default {
        data() {
            return {
                //优惠券表格列
                columns: couponColumns,
                //查询参数
                listQuery: Object.assign({}, defaultListQuery),
                //优惠券类型
                couponTypeList: Object.assign({}, defaultTypeOptions),
                //优惠券列表
                couponList: [],
                //表格加载数据loading
                loading: false,
                //多选选项
                multipleSelection: [],
                //优惠券表格分页配置项
                pagination: {
                   total: 0,
                   pageNum: 1,
                   pageSize: 5,
                   showSizeChanger: true, 
                   pageSizeOptions:['5','10','15'],
                   showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
                   onChange: pageNum => {
                       console.log(pageNum)
                        this.pagination.pageNum = pageNum;
                        this.getCouponListData()
                    },
                    onShowSizeChange: (current, pageSize) => {
                        this.pagination.pageNum = current;
                        this.pagination.pageSize = pageSize;
                        this.getCouponListData()
                    }
                },
            }
        },
        created() {
            this.getCouponListData()
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
            formatCouponType(type){
                for(let item of defaultTypeOptions) {
                    if(type === item.value) {
                        return item.label;
                    }
                }
            },
            //处理优惠券使用范围
            formatUseType(useType) {
                switch(useType) {
                    case 1:
                        return '指定分类';
                    case 2:
                        return '指定商品';
                    default:
                        return '全场通用'        
                }
            },
            //处理优惠使用平台
            formatPlatform(platform) {
                switch(platform) {
                    case 1:
                        return '移动端';
                    case 2:
                        return 'PC端';
                    default:
                        return '全平台'        
                }
            },
            //格式化时间
            formatDate(time) {
                if(time==null||time===''){
                    return 'N/A';
                }
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd')
            },
            //处理活动状态
            formatStatus(endTime){
                let now = new Date().getTime();
                let endDate = new Date(endTime);
                return endDate > now ? '为过期' : '已过期';
            }
        },
        methods: {
            //重置表单项
            handleResetSearch(){
                let { name, type } = this.listQuery;
                if(name || type !== undefined) {
                    this.$refs.form.resetFields();
                    //重置pageNum为1
                    this.$set(this.pagination.pageNum, 1)
                    this.getCouponListData();
                } 
                return;
            },
            //搜索查询
            handleSearchList() {
                let { name, type } = this.listQuery;
                if(name || type !== undefined) {
                    //重置pageNum为1
                    this.pagination.pageNum = 1;
                    this.getCouponListData();
                } 
                return;
            },
            //获取优惠券列表
            async getCouponListData() {
                this.loading = true;
                this.couponList = [];
                const { pageNum, pageSize } = this.pagination;
                const params = Object.assign({}, this.listQuery, {pageNum, pageSize})
                const res = await getCouponList(params);
                
                const { list, total } = res.data.data;
                this.pagination.total = total;
                list.map(item => {
                    this.couponList.push({
                        key: item.id,
                        id: item.id,
                        name: item.name,
                        type: item.type,
                        useType: item.useType,
                        minPoint: item.minPoint,
                        amount: item.amount,
                        platform: item.platform,
                        period: item.startTime,
                        endTime: item.endTime
                    })
                })
                this.loading = false;
            },
            //处理查看优惠券函数
            handleView(row){
                this.$router.push({path:'/sms/couponHistory', query:{id: row.id}})
            },
            //删除某项活动
            handleDelete(row){
                const _self = this;
                this.$confirm({
                    title: '提示',
                    content: '是否要删除该优惠券?',
                    onOk() {
                        deleteCoupon(row.id).then(res => {
                            _self.$message.success(res.message);
                            _self.getCouponListData()
                        }).catch(error => {
                            _self.$message.error(error.message);
                        })
                    }
                })
            },
            //清除下拉框的选项时的函数
            handleSelectChange(type){
                if(type === undefined) {
                    this.getCouponListData();
                }
            },
            //编辑优惠券函数
            handleUpdate(row){
                this.$router.push({path: '/sms/updateCoupon', query: {id: row.id}})
            },
            //选择项点击回调
            handleSelectionChange(changeableRowKeys) {
                this.multipleSelection = changeableRowKeys;
            },
            //添加优惠券的处理函数
            handleAddCoupon() {
                this.$router.push({path: '/sms/addCoupon'})
            }
        },
    }
</script>

<style lang="less" scoped>
.coupon-list {
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