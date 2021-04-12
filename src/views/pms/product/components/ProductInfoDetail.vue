<template>
  <a-form-model 
    :model="value" 
    ref="productInfoForm"
    :rules="rules"
    @submit="handleSubmit" 
    :label-col="labelCol" 
    :wrapper-col="wrapperCol"
>
      <a-form-model-item label="商品分类" v-bind="formItemLayout" prop="productCategoryId" colon>
        <a-cascader
            v-model="selectProductCateValue"
            placeholder="请选择商品分类"
            :options="productCateOptions"
        />
    </a-form-model-item>
    <a-form-model-item  label="商品名称" prop="name" colon>
      <a-input v-model="value.name"/>
    </a-form-model-item>
    <a-form-model-item label="副标题" prop="subTitle" colon>
      <a-input v-model="value.subTitle"/>
    </a-form-model-item>
    <a-form-model-item label="商品品牌" v-bind="formItemLayout" prop="brandId" colon>
        <a-select placeholder="请选择商品品牌" v-model="value.brandId" @change="handleBrandChange">
            <a-select-option 
                v-for="option in brandOptions" 
                :vlaue="option.name" 
                :key="option.id" 
            >
                {{option.name}}
            </a-select-option>
        </a-select>
    </a-form-model-item>
    <a-form-model-item label="商品介绍" colon>
         <a-input
          :autoSize="true"
          v-model="value.description"
          type="textarea"
          style="lineHeight: 3"
          placeholder="请输入内容" />
    </a-form-model-item>
    <a-form-model-item label="商品货号" colon>
        <a-input v-model="value.productSn"/>
    </a-form-model-item>
    <a-form-model-item label="商品售价" colon>
        <a-input v-model="value.price"/>
    </a-form-model-item>
    <a-form-model-item label="市场价" colon>
        <a-input v-model="value.originalPrice"/>
    </a-form-model-item>
    <a-form-model-item label="商品库存" colon>
        <a-input v-model="value.stock"/>
    </a-form-model-item>
    <a-form-model-item label="计量单位" colon>
        <a-input v-model="value.unit"/>
    </a-form-model-item>
    <a-form-model-item label="商品重量" v-bind="formItemLayout" colon>
        <a-input v-model="value.weight"/>
    </a-form-model-item>
    <a-form-model-item label="排序" colon>
        <a-input v-model="value.sort"/>
    </a-form-model-item>
    <a-form-model-item style="margin-left: 200px">
        <a-button type="primary" @click="handleNext('productInfoForm')">下一步，填写商品促销</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { getProductListWithChildren, getBrandList } from '@/api/product'
export default {
    props: {
        value: Object,
    },
  data() {
    return {
      //选中商品分类的值
      selectProductCateValue: [],
      brandOptions: [],
      productCateOptions: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      formItemLayout: {
        wrapperCol: { span: 8 },
       },
       rules: {
           name: [
               { required: true,message: '请输入商品名称', trigger: 'blur' },
               { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
           ],
           subTitle: [
               { required: true,message: '请输入商品副标题', trigger: 'blur' }
           ],
           productCategoryId: [
               { required: true, message: '请选择商品分类', trigger: 'blur' }
           ],
           brandId: [
               { required: true, message: '请选择商品品牌', trigger: 'change' }
           ],
           description: [
               { message: '请输入商品介绍', trigger: 'blur' }
           ]
       },
    };
  },
  created() {
      this.getProductCateList();
      this.getBrandListAll();
  },
  watch: {
      selectProductCateValue: function(newValue) {
          if(newValue && newValue.length === 2){
              this.value.productCategoryName = newValue[0];
              this.value.productCategoryId = newValue[1];
          } 
      }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    },
    async getProductCateList() {
                const res = await getProductListWithChildren();
                const productCateList = res.data.data;
                this.productCateOptions = [];
                for(let item of productCateList) {
                    let childrens = [];
                    if(item.children && item.children.length > 0) {
                        for(let children of item.children) {
                            childrens.push({value: children.name, label: children.name})
                        }
                    }
                    this.productCateOptions.push({value: item.name, label: item.name, children: childrens})
                    console.log(this.productCateOptions)
                }
            },
    async getBrandListAll() {
        const res = await getBrandList({pageNum: 1, pageSize: 100});
        const brandList = res.data.data.list;
        this.brandOptions = brandList;
    },
    handleNext(formName) {
        this.$refs[formName].validate(valid => {
            if(valid) {
                this.$emit('nextStep')
            } else {
                this.$message.error('验证失败')
                return false;
            }
        })
    },
    handleBrandChange(val) {
        let brandName = '';
        for(let item of this.brandOptions) {
            if(item.id === val) {
                brandName = item.name;
            }
        }
        this.value.brandName = brandName;
        console.log(this.value)
    }
  },
};
</script>