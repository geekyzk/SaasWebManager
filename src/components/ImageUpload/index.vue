<template>
  <el-upload
    :action="uploadParams.actionUrl"
    :headers="uploadParams.headers"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    class="avatar-uploader">
    <img v-if="tempImageUrl" :src="realStaticUrl(tempImageUrl)" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"/>
  </el-upload>
</template>

<script type="text/ecmascript-6">
import { realStaticUrl, uploadParams } from '@/utils'
export default {
  name: 'ImageUpload',
  components: {

  },
  model: {
    prop: 'imageUrl',
    event: 'change'
  },
  props: {
    imageUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      uploadParams: uploadParams(),
      tempImageUrl: ''
    }
  },
  mounted() {
    this.tempImageUrl = this.imageUrl
  },
  methods: {
    realStaticUrl,
    handleAvatarSuccess(res, file) {
      this.$emit('change', res.data.url)
      this.tempImageUrl = res.data.url
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    }
  }
}
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
