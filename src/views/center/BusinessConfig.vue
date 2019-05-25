<template>
  <div class="page">
    <el-form ref="form" :label-position="'left'" label-width="120px" style="width: 100%; padding-left:10px;padding-right:10px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="商家名称">
            <span>{{ businessConfig.name }}</span>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-col :span="12">
            <el-button size="small"  @click="handleEditBusiness">配置商店</el-button>
          </el-col>
        </el-col> -->
      </el-row>
      <el-form-item label="商店名称">
        <span>{{ businessConfig.shopName }}</span>
      </el-form-item>
      <el-form-item label="LOGO" style="height:200px">
        <!-- <ImageUpload v-model="businessConfig.logo" ></ImageUpload> -->
        <el-upload
          :action="uploadParams.actionUrl"
          :headers="uploadParams.headers"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          class="avatar-uploader">
          <img v-if="businessLogo" :src="realStaticUrl(businessLogo)" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="公众号">
            <span v-if="wechatInfo !== '' && wechatInfo !== undefined  ">{{ wechatInfo.name }}</span>
            <span v-else>请先设置公众号信息</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button size="small" @click="handleEditWechat">配置微信</el-button>
        </el-col>
      </el-row>

      <el-form-item label="成立时间">
        <span>{{ businessConfig.createAt }}</span>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogWeChatFormVisible" title="微信设置" width="60%" top="7vh">
      <el-form ref="wechatInfoForm" :model="wechatInfo" :rules="rules" class="form-add" label-width="100px" style="width: 100%; padding-left:10px;padding-right:10px">
        <el-form-item label="微信名称">
          <el-input v-model="wechatInfo.name" style="width:100%"/>
        </el-form-item>
        <el-form-item label="AppId" prop="appId">
          <el-input v-model="wechatInfo.appId" style="width:100%"/>
        </el-form-item>
        <el-form-item label="AppSecret" prop="appSecret">
          <el-input v-model="wechatInfo.appSecret" style="width:100%"/>
        </el-form-item>
        <el-form-item label="token" prop="token">
          <el-input v-model="wechatInfo.token" style="width:100%"/>
        </el-form-item>
        <el-form-item label="aesKey" prop="aesKey">
          <el-input v-model="wechatInfo.aesKey" style="width:100%"/>
        </el-form-item>
        <el-form-item label="商户Id" prop="mchId">
          <el-input v-model="wechatInfo.mchId" style="width:100%"/>
        </el-form-item>
        <el-form-item label="商户密钥" prop="mchKey">
          <el-input v-model="wechatInfo.mchKey" style="width:100%"/>
        </el-form-item>
        <el-form-item label="重定向地址" prop="redirectUri">
          <el-input v-model="wechatInfo.redirectUri" style="width:100%"/>
        </el-form-item>
        <el-form-item label="商城地址" prop="shopUri">
          <el-input v-model="wechatInfo.shopUri" style="width:100%"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogWeChatFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogWeChatStatus=='create'" :loading="buttonLoading" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else :loading="buttonLoading" type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { realStaticUrl, uploadParams } from '@/utils'
import { listWechatInfo, createWechatInfo, updateWechatInfo } from '@/api/WechatInfoApi'
import { updateBusinessConfig } from '@/api/BusinessConfigApi'

export default {
  components: {

  },
  data() {
    return {
      form: {
        name: '',
        shopName: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      uploadParams: uploadParams(),
      buttonLoading: false,
      wechatInfo: {
        name: undefined
      },
      businessLogo: undefined,
      dialogWeChatStatus: '',
      dialogWeChatFormVisible: false,
      dialogBusinessVisible: false,
      rules: {
        token: [{ required: true, message: 'token为必须参数', trigger: 'change' }],
        aesKey: [{ required: true, message: 'aesKey为必须参数', trigger: 'change' }],
        mchId: [{ required: true, message: '商户Id为必须参数', trigger: 'change' }],
        mchKey: [{ required: true, message: '商户密钥为必须参数', trigger: 'change' }],
        shopUri: [{ required: true, message: '商城地址为必须参数', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters(['businessConfig'])
  },
  created() {
    listWechatInfo({ size: 1 }).then(resp => {
      if (resp.data.data[0] === undefined) {
        this.wechatInfo = {}
      } else {
        this.wechatInfo = resp.data.data[0]
      }
      // this.wechatInfo = resp.data.data[0]
    })
    this.businessLogo = this.businessConfig.logo
  },
  methods: {
    realStaticUrl,
    onSubmit() {
      console.log('submit!')
    },
    handleEditWechat() {
      if (this.wechatInfo === undefined || this.wechatInfo.id === undefined) {
        this.dialogWeChatStatus = 'create'
      } else {
        this.dialogWeChatStatus = 'update'
      }
      this.dialogWeChatFormVisible = true
    },
    handleEditBusiness() {
      this.dialogBusinessVisible = true
    },
    createData() {
      this.$refs['wechatInfoForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          createWechatInfo(this.wechatInfo).then(response => {
            this.buttonLoading = false
            if (response.data.code === -1) {
              this.$message({
                title: '失败',
                message: response.data.message,
                type: 'error'
              })
            } else {
              this.dialogWeChatFormVisible = false
              this.$message({
                title: '成功',
                message: response.data.message,
                type: 'success'
              })
              this.wechatInfo = response.data.data
            }
          }).catch(() => {
            this.$message({
              title: '失败',
              message: '请求数据失败',
              type: 'error'
            })
            this.buttonLoading = false
          })
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.businessLogo = res.data.url
      updateBusinessConfig(this.businessConfig.id, {logo: res.data.url}).then(resp => {
        console.log(resp)
      })
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    updateData() {
      this.$refs['wechatInfoForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          updateWechatInfo(this.wechatInfo.id, this.wechatInfo).then(response => {
            this.buttonLoading = false
            if (response.data.code === -1) {
              this.$message({
                title: '失败',
                message: response.data.message,
                type: 'error'
              })
            } else {
              this.dialogWeChatFormVisible = false
              this.$message({
                title: '成功',
                message: response.data.message,
                type: 'success'
              })
              this.wechatInfo = response.data.data
            }
          }).catch(() => {
            this.$message({
              title: '失败',
              message: '更新数据失败',
              type: 'error'
            })
            this.buttonLoading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped >
.page {
  width: 70%;
  padding-top:50px;
   margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
