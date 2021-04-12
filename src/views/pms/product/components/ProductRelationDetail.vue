<template>
    <div class="product-relation-detail">
        <a-form-model 
            :model="value" 
            :label-col="labelCol" 
            :wrapper-col="wrapperCol">
            <a-form-model-item label="关联专题" v-bind="formItemStyle" colon>
                <a-transfer
                    :data-source="subjectList"
                    show-search
                    v-model="selectSubject"
                    :titles="subjectTitles"
                    :filter-option="filterOption"
                    :target-keys="subjectTargetKeys"
                    :render="item => item.title"
                    :list-style="listStyle"
                    @change="handleSubgectChange"
                />
            </a-form-model-item>
            <a-form-model-item label="关联优选" v-bind="formItemStyle" colon>
                <a-transfer
                    :data-source="prefrenceAreaList"
                    show-search
                    v-model="selectPrefrenceArea"
                    :titles="prefrenceAreaTitles"
                    :filter-option="filterOption"
                    :target-keys="prefrenceAreaTargetKeys"
                    :render="item => item.title"
                    :list-style="listStyle"
                    @change="handleprefrenceAreaChange"
                />
            </a-form-model-item>
            <a-form-model-item style="text-align: center">
                <a-button @click="handlePrev">上一步，填写商品属性</a-button>
                <a-button type="primary" @click="handleFinishCommit">完成，提交商品</a-button>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>

<script>
import { getSubjectRelationList, getPrefrenceAreaList } from '@/api/product'
    export default {
    data() {
        return {
            //商品关联列表
            subjectList: [],
            //专题左右标题
            subjectTitles: ['待选择', '已选择'],
            subjectTargetKeys: [],
            //所有专题列表
            prefrenceAreaList: [],
            //专题左右标题
            prefrenceAreaTitles: ['待选择', '已选择'],
            prefrenceAreaTargetKeys: [],
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 15 },
                sm: { span: 20 },
            },
            listStyle: {
                width: '220px',
                minHeight: '280px'
            },
            formItemStyle: {
                labelCol: { span: 6},
                wrapperCol: {span: 16}
            }
        };
    },
    props: {
        value: Object
    },
    created() {
        this.getSubjectRelationListData();
        this.getPrefrenceAreaListData();
    },
    computed: {
        //选中的专题
        selectSubject:{
            get: function() {
                let subjects = [];
                let list = this.value.subjectProductRelationList
                if(list == null || list.length<=0){
                    return subjects;
                }
                for (let item of list){
                    subjects.push(item);
                }
                return subjects;
            },
            set: function(newValue) {
                this.value.subjectProductRelationList=[];
                for(let item of newValue) {
                    this.value.subjectProductRelationList.push({subjectId: item})
                }
            }
        },
        //选中的优选
        selectPrefrenceArea: {
            get: function() {
                let prefrenceAreas =[];
                let list = this.value.prefrenceAreaProductRelationList;
                if(list == null || list.length <= 0) {
                    return prefrenceAreas;
                } 
                for(let item of list){
                    prefrenceAreas.push(item.prefrenceAreaId)
                }
                return prefrenceAreas;
            },
            set: function(newValue) {
                this.value.prefrenceAreaProductRelationList=[];
                for(let item of newValue){
                    this.value.prefrenceAreaProductRelationList.push({prefrenceAreaId: item})
                }
            }
        }
    },
    methods: {
        //获取商品关联专题列表
        async getSubjectRelationListData() {
            const res = await getSubjectRelationList();
            console.log(res)
            const list = res.data.data;
            list.map(item => {
                this.subjectList.push({
                    key: item.id.toString(),
                    title: item.title
                })
            })
        },
        //获取优选关联列表
        async getPrefrenceAreaListData() {
            const res = await getPrefrenceAreaList();
            console.log(res)
            const list = res.data.data;
            list.map(item => {
                this.prefrenceAreaList.push({
                    key: item.id.toString(),
                    title: item.name
                })
            })
        },
        filterOption(inputValue, option) {
            return option.title.indexOf(inputValue) > -1;
        },
        handleSubgectChange(targetKeys, direction, moveKeys) {
            console.log(targetKeys, direction, moveKeys);
            this.subjectTargetKeys = targetKeys;
        },
        handleprefrenceAreaChange(targetKeys, direction, moveKeys){
            console.log(targetKeys, direction, moveKeys);
            this.prefrenceAreaTargetKeys = targetKeys;
        },
        //点击上一步
        handlePrev(){
            this.$emit('prevStep')
        },
        //点击完成
        handleFinishCommit(){
            this.$emit('finishCommit')
        }
    },
};
</script>

<style lang="less" scoped>

</style>