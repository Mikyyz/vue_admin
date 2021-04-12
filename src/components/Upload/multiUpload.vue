<template>
  <div class="clearfix">
    <a-upload
      list-type="picture-card"
      :action="useOss ? ossUploadUrl : minioUploadUrl"
      :data="useOss ? dataObj : null"
      :file-list="fileList"
      :before-upload="beforeUpload"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < 4">
        <a-icon type="plus" />
        <div class="ant-upload-text">
          上传图片
        </div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img :alt="previewImage" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
import { policy } from '@/api/oss';
export default {
    name: 'multiUpload',
  data() {
    return {
        //上传的参数对象
        dataObj: {
          policy: '',
          signature: '',
          key: '',
          ossaccessKeyId: '',
          dir: '',
          host: ''
        },
        useOss: true,//使用oss->true;使用MinIO->false
        previewVisible: false,
        previewImage: '',//预览的图片
        ossUploadUrl:'http://macro-oss.oss-cn-shenzhen.aliyuncs.com',
    };
  },
  props: {
      value: Array
  },
  computed: {
      fileList() {
          let fileList=[];
          for(let item of this.value) {
              fileList.push(item)
          }
          return fileList;
      }
  },
  methods: {
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {
        let url = `${this.dataObj.host}/${this.dataObj.dir}/${fileList.name}`;
        this.fileList.push({name: fileList.name, url: url})
    },
    beforeUpload(file) {
        let _self = this;
        console.log(file)
        if(!this.useOss) {
             //不使用oss不需要获取策略
            return true;
        }
        return new Promise((resolve, reject) => {
            policy().then(res => {
                _self.dataObj.policy = res.data.policy;
                _self.dataObj.signature = res.data.signature;
                _self.dataObj.ossaccessKeyId = res.data.accessKeyId;
                _self.dataObj.key = res.data.dir + '/${filename}';
                _self.dataObj.dir = res.data.dir;
                _self.dataObj.host = res.data.host;
                console.log(res)
                resolve(true)
            }).catch(err => {
                reject(err);
            })
        })
    }
  },
};
</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
