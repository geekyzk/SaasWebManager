<template>
  <div class="app-container">
    <!-- 查询参数过滤 -->
    <div class="filter-container">
      <el-row :gutter="10">
        <el-form>
          <el-col :span="2">
            <el-button class="filter-item" style="width:100%;padding: 10px 0px;" type="primary" icon="el-icon-plus" @click="handleCreate">{{ $t('table.add') }}</el-button>
          </el-col>
          <!-- <el-col :span="2">
            <el-button :disabled="total == 0" :loading="downloadLoading" type="primary" style="width:100%;padding: 10px 0px;" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
          </el-col> -->
          <el-col :span="4">
            <el-form-item label="商品名称" label-width="80px">
              <el-input
                v-model="listParams['name.equals']"
                style="width: 100%;"
                class="filter-item"
                placeholder="商品名称"
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button v-waves class="filter-item" style="width:100%;padding: 10px 0px;" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <el-row>
      <div class="chart-container">
        <el-table v-loading="loading" ref="GoodsTable" :data="data" border fit highlight-current-row style="width: 100%;" @sort-change="sortSignTime" @row-dblclick="openDetails">
          <!-- 操作 -->
          <el-table-column :label="$t('table.actions')" align="center" width="80px" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="text" title="编辑" @click="handleUpdate(scope.row)"><i class="el-icon-edit"/></el-button>
              <el-button type="text" title="删除" @click="deleteData(scope.row.id)"><i class="el-icon-delete"/></el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" align="center" width="50"/>
          <el-table-column prop="name" label="商品名称" align="center" >
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column prop="clickNum" label="点击数" align="center">
            <template slot-scope="scope">
              {{ scope.row.clickNum }}
            </template>
          </el-table-column>
          <el-table-column prop="goodsSn" label="商品编号" align="center">
            <template slot-scope="scope">
              {{ scope.row.goodsSn }}
            </template>
          </el-table-column>
          <el-table-column prop="soldNum" label="销售量" align="center">
            <template slot-scope="scope">
              {{ scope.row.soldNum }}
            </template>
          </el-table-column>
          <el-table-column prop="goodsNum" label="库存数" align="center">
            <template slot-scope="scope">
              {{ scope.row.goodsNum }}
            </template>
          </el-table-column>
          <el-table-column prop="marketPrice" label="市场价格" align="center">
            <template slot-scope="scope">
              {{ scope.row.marketPrice }}
            </template>
          </el-table-column>
          <el-table-column prop="shopPrice" label="本店价格" align="center">
            <template slot-scope="scope">
              {{ scope.row.shopPrice }}
            </template>
          </el-table-column>
          <el-table-column prop="sourcePrice" label="进货价" align="center">
            <template slot-scope="scope">
              {{ scope.row.sourcePrice }}
            </template>
          </el-table-column>
          <el-table-column prop="goodsBrief" label="简要描述" align="center">
            <template slot-scope="scope">
              {{ scope.row.goodsBrief }}
            </template>
          </el-table-column>
          <el-table-column prop="shipFree" label="是否免邮" align="center">
            <template slot-scope="scope">
              <BooleanTag v-model="scope.row.shipFree"/>
            </template>
          </el-table-column>
          <el-table-column prop="showImage" label="封面图片" align="center">
            <template slot-scope="scope">
              <span>
                <img :src="realStaticUrl(scope.row.showImage)" alt="" style="width: 50px;height:50px;">
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="goodsDesc" label="商品介绍" align="center">
            <template slot-scope="scope">
              {{ scope.row.goodsDesc }}
            </template>
          </el-table-column>
          <el-table-column prop="isNew" label="是否新品" align="center">
            <template slot-scope="scope">
              <BooleanTag v-model="scope.row.isNew"/>
            </template>
          </el-table-column>
          <el-table-column prop="isHot" label="是否热门" align="center">
            <template slot-scope="scope">
              <BooleanTag v-model="scope.row.isHot"/>
            </template>
          </el-table-column>
          <el-table-column prop="createAt" label="创建时间" align="center">
            <template slot-scope="scope">
              {{ scope.row.createAt | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="updateAt" label="更新时间" align="center">
            <template slot-scope="scope">
              {{ scope.row.updateAt | formatDate }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          :current-page="listParams.page"
          :page-sizes="pageSize"
          :page-size="listParams.size"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </el-row>

    <!-- 对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" top="7vh" @opened="initDialogInfo">
      <el-form ref="goodsForm" :model="goodsTemp" :rules="rules" class="form-add" label-width="100px" style="width: 100%; padding-left:10px;padding-right:10px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="goodsTemp.name" style="width:100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品编号" prop="goodsSn">
              <el-input v-model="goodsTemp.goodsSn" style="width:100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品类别">
              <el-select v-model="goodsTemp.goodsCategoryId">
                <el-option v-for="item in categoryList" :key="item.id" :value="item.id" :label="item.name"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="进货价" prop="sourcePrice">
              <el-input-number v-model="goodsTemp.sourcePrice" style="width:100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="本店价格" prop="shopPrice">
              <el-input-number v-model="goodsTemp.shopPrice" style="width:100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="市场价格" prop="marketPrice">
              <el-input-number v-model="goodsTemp.marketPrice" style="width:100%"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="库存数" prop="goodsNum">
              <el-input-number v-model="goodsTemp.goodsNum" style="width:100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售量" prop="soldNum">
              <el-input-number v-model="goodsTemp.soldNum" style="width:100%"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="是否免邮" prop="shipFree">
              <el-switch
                v-model="goodsTemp.shipFree"
                active-color="#13ce66"
                inactive-color="#ff4949"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否新品" prop="isNew">
              <el-switch
                v-model="goodsTemp.isNew"
                active-color="#13ce66"
                inactive-color="#ff4949"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否热门" prop="isHot">
              <el-switch
                v-model="goodsTemp.isHot"
                active-color="#13ce66"
                inactive-color="#ff4949"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="封面图片" prop="showImage">
          <el-upload
            :action="uploadParams.actionUrl"
            :headers="uploadParams.headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            class="avatar-uploader">
            <img v-if="goodsTemp.showImage" :src="realStaticUrl(goodsTemp.showImage)" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>

        <el-form-item label="轮播图片" prop="goodsImages">
          <el-upload
            :action="uploadParams.actionUrl"
            :headers="uploadParams.headers"
            :on-preview="handlePictureCardPreview"
            :on-success="handlePictureCardSuccess"
            :file-list="fileList"
            :on-remove="handleRemove"
            list-type="picture-card">
            <i class="el-icon-plus"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="简要描述" prop="goodsBrief">
          <el-input v-model="goodsTemp.goodsBrief" type="textarea" style="width:100%"/>
        </el-form-item>

        <el-form-item label="商品介绍" prop="goodsDesc">
          <div ref="editor" style="text-align:left;width:100%;height:400px"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" :loading="buttonLoading" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else :loading="buttonLoading" type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" width="100%" alt="">
    </el-dialog>
    <el-dialog :visible.sync="dialogDetailVisible" title="详情" width="40%" top="7vh" style="width: 100%; padding-left:10px;padding-right:10px">
      <el-form ref="form" :model="showData" label-width="90px" label-position="left" style="padding-left: 20px">
        <el-form-item label="商品名称">
          <span> {{ showData.name }}</span>
        </el-form-item >
        <el-form-item label="点击数">
          <span> {{ showData.clickNum }}</span>
        </el-form-item >
        <el-form-item label="商品编号">
          <span> {{ showData.goodsSn }}</span>
        </el-form-item >
        <el-form-item label="销售量">
          <span> {{ showData.soldNum }}</span>
        </el-form-item >
        <el-form-item label="库存数">
          <span> {{ showData.goodsNum }}</span>
        </el-form-item >
        <el-form-item label="市场价格">
          <span> {{ showData.marketPrice }}</span>
        </el-form-item >
        <el-form-item label="本店价格">
          <span> {{ showData.shopPrice }}</span>
        </el-form-item >
        <el-form-item label="进货价">
          <span> {{ showData.sourcePrice }}</span>
        </el-form-item >
        <el-form-item label="商品简要描述">
          <span> {{ showData.goodsBrief }}</span>
        </el-form-item >
        <el-form-item label="是否免邮">
          <span> {{ showData.shipFree }}</span>
        </el-form-item >
        <el-form-item label="封面图片">
          <span> {{ showData.showImage }}</span>
        </el-form-item >
        <el-form-item label="商品介绍">
          <span> {{ showData.goodsDesc }}</span>
        </el-form-item >
        <el-form-item label="是否新品">
          <span> {{ showData.isNew }}</span>
        </el-form-item >
        <el-form-item label="是否热门">
          <span> {{ showData.isHot }}</span>
        </el-form-item >
        <el-form-item label="创建时间">
          <span>{{ showData.createAt | formatDate }}</span>
        </el-form-item>
        <el-form-item label="更新时间">
          <span>{{ showData.updateAt | formatDate }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import E from 'wangeditor'
import { listGoods, createGoods, updateGoods, deleteGoods, retrieveGoods } from '@/api/GoodsApi'
import waves from '@/directive/waves'
import { formatDate, realStaticUrl, uploadParams } from '@/utils'
import { getToken } from '@/utils/auth'
import wangStyle from '@/utils/wangEditorUtil'
import { listGoodsCategory } from '@/api/GoodsCategoryApi'

export default {
  name: 'Goods',
  directives: {
    waves
  },
  data() {
    return {
      loading: false,
      buttonLoading: false,
      pageSize: [10, 20, 30, 50],
      downloadLoading: false,
      dialogFormVisible: false,
      dialogDetailVisible: false,
      total: null,
      dialogStatus: '',
      textMap: {
        update: '编辑商品管理',
        create: '添加商品管理'
      },
      showData: '',
      listParams: {
        page: 1,
        size: 10,
        'name.contains': undefined
      },
      uploadParams: uploadParams(),
      data: [],
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      fileListTemp: [],
      categoryList: [],
      goodsTemp: {
        name: undefined,
        clickNum: undefined,
        goodsSn: undefined,
        soldNum: undefined,
        goodsNum: undefined,
        marketPrice: undefined,
        shopPrice: undefined,
        sourcePrice: undefined,
        goodsBrief: undefined,
        shipFree: true,
        showImage: undefined,
        goodsDesc: undefined,
        isNew: true,
        isHot: false,
        goodsImages: [],
        goodsCategoryId: undefined,
        id: undefined
      },
      editor: undefined,
      editorContent: '',
      rules: {
        goodsSn: [{ required: true, message: '商品编号为必须参数', trigger: 'change' }],
        goodsNum: [{ required: true, message: '库存数为必须参数', trigger: 'change' }],
        marketPrice: [{ required: true, message: '市场价格为必须参数', trigger: 'change' }],
        shopPrice: [{ required: true, message: '本店价格为必须参数', trigger: 'change' }],
        sourcePrice: [{ required: true, message: '进货价为必须参数', trigger: 'change' }],
        goodsBrief: [{ required: true, message: '商品简要描述为必须参数', trigger: 'change' }],
        shipFree: [{ required: true, message: '是否免邮为必须参数', trigger: 'change' }],
        showImage: [{ required: true, message: '封面图片为必须参数', trigger: 'change' }]
      }
    }
  },
  created() {
    this.list()
    this.initCategory()
  },
  mounted() {
  },
  methods: {
    wangStyle,
    realStaticUrl,
    list() {
      const params = {
        page: this.listParams.page,
        size: this.listParams.size,
        'name.equals': this.listParams['name.equals'] === '' ? undefined : this.listParams['name.equals'],
        'clickNum.equals': this.listParams['clickNum.equals'] === '' ? undefined : this.listParams['clickNum.equals'],
        'sort': this.listParams['sort'] === '' ? null : this.listParams['sort']
      }
      this.loading = true
      listGoods(params).then(response => {
        this.loading = false
        this.data = response.data.data
        this.total = response.data.totalSize
      })
    },
    sortSignTime(column) {
      if (column.order === 'ascending') {
        this.listParams['sort'] = `${column.prop},asc`
      } else if (column.order === 'descending') {
        this.listParams['sort'] = `${column.prop},desc`
      } else {
        this.listParams['sort'] = null
      }
      this.page = 1
      this.list()
    },
    initEdit() {
      console.log(this.$refs.editor)
      if (this.$refs.editor === undefined) {
        return
      }
      if (this.editor === undefined || this.editor === null) {
        var editor = new E(this.$refs.editor)
        editor.customConfig.uploadImgServer = process.env.BASE_API + '/api/editUpload'
        editor.customConfig.onchange = (html) => {
          this.editorContent = html
        }
        editor.customConfig.uploadFileName = 'file'
        editor.customConfig.uploadImgMaxLength = 5
        editor.customConfig.uploadImgHeaders = {
          'Authorization': getToken()
        }
        editor.customConfig.emotions = [{
          title: '默认',
          type: 'image',
          content: [{
            alt: '[坏笑]',
            src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/50/pcmoren_huaixiao_org.png'
          }, {
            alt: '[舔屏]',
            src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/pcmoren_tian_org.png'
          }]
        }]
        editor.customConfig.zIndex = 0
        editor.create()
        editor.txt.html(this.editorContent)
        this.editor = editor
      } else {
        this.editor.txt.clear()
        this.editor.txt.html(this.editorContent)
      }
    },
    initDialogInfo() {
      console.log(this.$refs)
      this.initEdit()
    },
    openDetails(row) {
      this.showData = row
      this.dialogDetailVisible = true
    },
    resetgoodsTemp() {
      this.goodsTemp = {
        goodsImages: [],
        name: undefined,
        clickNum: undefined,
        goodsSn: undefined,
        soldNum: undefined,
        goodsNum: undefined,
        marketPrice: undefined,
        shopPrice: undefined,
        sourcePrice: undefined,
        goodsBrief: undefined,
        goodsCategoryId: undefined,
        shipFree: true,
        showImage: undefined,
        goodsDesc: undefined,
        isNew: true,
        isHot: false,
        id: undefined
      }
      this.editorContent = ''
      this.fileList = []
      this.fileListTemp = []
    },
    handleCreate() {
      this.resetgoodsTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['goodsForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['goodsForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          this.goodsTemp.goodsDesc = this.editorContent + this.wangStyle()
          this.goodsTemp.goodsImages = this.fileListTemp
          createGoods(this.goodsTemp).then(response => {
            this.buttonLoading = false
            if (response.data.code === -1) {
              this.$message({
                title: '失败',
                message: response.data.message,
                type: 'error'
              })
            } else {
              this.list()
              this.dialogFormVisible = false
              this.$message({
                title: '成功',
                message: response.data.message,
                type: 'success'
              })
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
    initCategory() {
      listGoodsCategory({ size: 100 }).then(resp => {
        this.categoryList = resp.data.data
      })
    },
    handleAvatarSuccess(res, file) {
      console.log(res)
      this.goodsTemp.showImage = res.data.url
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    handleRemove(file, fileList) {
      this.fileListTemp = this.fileListTemp.filter(item => item !== file.name)
    },
    handlePictureCardPreview(file) {
      console.log(file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handlePictureCardSuccess(resp, file, fileList) {
      this.fileListTemp.push(resp.data.url)
      this.fileList.push({ url: realStaticUrl(resp.data.url), uid: resp.data.url, name: resp.data.url })
    },
    handleUpdate(row) {
      retrieveGoods(row.id).then(resp => {
        this.goodsTemp = resp.data
        this.editorContent = this.goodsTemp.goodsDesc
        this.fileList = resp.data.goodsImages.map(item => {
          return { url: realStaticUrl(item), uid: item, name: item }
        })
        this.fileListTemp = resp.data.goodsImages
      })
      // Object.assign(this.goodsTemp, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['goodsForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['goodsForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          this.goodsTemp.goodsDesc = this.editorContent
          this.goodsTemp.goodsImages = this.fileListTemp
          updateGoods(this.goodsTemp.id, this.goodsTemp).then(response => {
            this.buttonLoading = false
            if (response.data.code === -1) {
              this.$message({
                title: '失败',
                message: response.data.message,
                type: 'error'
              })
            } else {
              this.list()
              this.dialogFormVisible = false
              this.$message({
                title: '成功',
                message: response.data.message,
                type: 'success'
              })
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
    },
    deleteData(id) {
      this.$confirm('确认删除该商品管理, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGoods(id).then(response => {
          if (response.data.code === -1) {
            this.$message({
              title: '失败',
              message: response.data.message,
              type: 'error'
            })
          } else {
            this.list()
            this.$message({
              title: '成功',
              message: response.data.message,
              type: 'success'
            })
          }
        }).catch(() => {
          this.$message({
            title: '失败',
            message: '删除数据失败',
            type: 'error'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleFilter() {
      this.listParams.page = 1
      this.list()
    },
    handleSizeChange(val) {
      this.listParams.size = val
      this.list()
    },
    handleCurrentChange(val) {
      this.listParams.page = val
      this.list()
    },
    // 导出数据为 excel
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['记录编号',
          '商品名称',
          '点击数',
          '商品编号',
          '销售量',
          '库存数',
          '市场价格',
          '本店价格',
          '进货价',
          '商品简要描述',
          '是否免邮',
          '封面图片',
          '商品介绍',
          '是否新品',
          '是否热门',
          '创建时间',
          '更新时间']
        const filterVal = ['id',
          'name',
          'clickNum',
          'goodsSn',
          'soldNum',
          'goodsNum',
          'marketPrice',
          'shopPrice',
          'sourcePrice',
          'goodsBrief',
          'shipFree',
          'showImage',
          'goodsDesc',
          'isNew',
          'isHot',
          'createAt',
          'updateAt']
        const params = Object.assign({}, this.listParams)
        params.size = this.total
        listGoods(params).then(response => {
          this.exportList = response.data.data
          const data = this.formatJson(filterVal, this.exportList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '商品管理数据表格'
          })
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createAt' || j === 'updateAt') {
          return formatDate(v[j])
        } else {
          return v[j]
        }
      }))
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
