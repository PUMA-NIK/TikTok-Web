<template>
  <div>
    <a-button type="primary" @click="upload">文件上传</a-button>
    <p>http://217.194.135.13:12345/v2/api/get/phone?name={{this.form.name}}</p>
    <a-modal v-model="uploadVisible" title="文件上传" ok-text="确认" cancel-text="取消" @ok='submitMwssage'>
      <a-form-model layout="horizontal" :model="form" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
        <a-form-model-item label="用户名称" prop="name">
          <a-input v-model="form.name"/>
        </a-form-model-item>
        <a-form-model-item label="文件内容">
          <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
              <a-button>
                <a-icon type="upload" /> 上传
              </a-button>
            </a-upload>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import axios from 'axios' // 引入axios
export default {
  data() {
    return {
      uploadVisible: false,
      form_rule: {
        name: [
          { required: true, message: '请输入文件名称', trigger: 'blur' },
        ]
      },
      form: {
        name: null,
        messageList:null
      },
      fileList: [],
      fileDataList: []
    }
  },
  mounted() {

  },
  methods:{
    upload() {
      this.uploadVisible = true
    },
    submitMwssage() {
      axios({
        url:'http://217.194.135.13:12345/v2/api/upload/phone',
        method: 'post',
        data: {
          userName: this.form.name,
          phoneList: this.fileDataList
        }
      }).then(res => { 
        if(res.data.code === 0) {
          this.uploadVisible = false
          this.$message.success(res.data.msg)
        }
      }).catch(err => {
        this.$message.error(err.data.msg)
      })
      // this.uploadVisible = false
    },
    handleRemove(file) {
      console.log(file)
    },
    beforeUpload(file) {
      let reader = new FileReader()
      reader.onload = (e) => {
        let fileList =e.target.result
        this.fileDataList = fileList.split(/[(\r\n)\r\n]+/)
      }
      reader.readAsText(file)
      this.fileList = []
      this.fileList = [file]
      return false
      
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
