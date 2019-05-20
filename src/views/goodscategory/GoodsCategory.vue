<template>
  <div class="app-container">
    <!-- 查询参数过滤 -->
    <div class="filter-container">
      <el-row :gutter="10">
        <el-form>
          <el-col :span="2">
            <el-button class="filter-item" style="width:100%;padding: 10px 0px;" type="primary" icon="el-icon-plus" @click="handleCreate">{{ $t('table.add') }}</el-button>
          </el-col>
          <el-col :span="2">
            <el-button :disabled="total == 0" :loading="downloadLoading" type="primary" style="width:100%;padding: 10px 0px;" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
          </el-col>
          <el-col :span="4">
            <el-form-item label="类别名称" label-width="80px">
              <el-input
                v-model="listParams['name.equals']"
                style="width: 100%;"
                class="filter-item"
                placeholder="类别名称"
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
        <el-table v-loading="loading" ref="GoodsCategoryTable" :data="data" border fit highlight-current-row style="width: 100%;" @sort-change="sortSignTime" @row-dblclick="openDetails">
          <!-- 操作 -->
          <el-table-column :label="$t('table.actions')" align="center" width="80px" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="text" title="编辑" @click="handleUpdate(scope.row)"><i class="el-icon-edit"/></el-button>
              <el-button type="text" title="删除" @click="deleteData(scope.row.id)"><i class="el-icon-delete"/></el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" align="center" width="50"/>
          <el-table-column prop="name" label="类别名称" align="center">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="首页展示" align="center">
            <template slot-scope="scope">
              <BooleanTag :tag-value="scope.row.showIndex"/>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="LOGO图" align="center">
            <template slot-scope="scope">
              <img v-show="scope.row.showIndex" :src="scope.row.image" style="width: 50px;height:50px;">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="首页布局" align="center">
            <template slot-scope="scope">
              {{ scope.row.indexLayout ? scope.row.indexLayout.label : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="desc" label="类别描述" align="center">
            <template slot-scope="scope">
              {{ scope.row.remark }}
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="48%" top="7vh">
      <el-form ref="goodsCategoryForm" :model="goodsCategoryTemp" :rules="rules" class="form-add" label-width="100px" style="width: 100%; padding-left:10px;padding-right:10px">
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="goodsCategoryTemp.name" style="width:100%"/>
        </el-form-item>
        <el-form-item label="首页展示" prop="shipFree">
          <el-switch
            v-model="goodsCategoryTemp.showIndex"
            active-color="#13ce66"
            inactive-color="#ff4949"/>
        </el-form-item>
        <el-form-item v-show="goodsCategoryTemp.showIndex" label="展示图片" prop="image">
          <ImageUpload v-model="goodsCategoryTemp.image" style="width:100%"/>
        </el-form-item>
        <el-form-item label="类别描述" prop="desc" >
          <el-input v-model="goodsCategoryTemp.remark" style="width:100%"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" :loading="buttonLoading" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else :loading="buttonLoading" type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogDetailVisible" title="详情" width="40%" top="7vh" style="width: 100%; padding-left:10px;padding-right:10px">
      <el-form ref="form" :model="showData" label-width="90px" label-position="left" style="padding-left: 20px">
        <el-form-item label="类别名称">
          <span> {{ showData.name }}</span>
        </el-form-item >
        <el-form-item label="类别描述">
          <span> {{ showData.desc }}</span>
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
import { listGoodsCategory, createGoodsCategory, updateGoodsCategory, deleteGoodsCategory } from '@/api/GoodsCategoryApi'
import waves from '@/directive/waves'
import { formatDate } from '@/utils'

export default {
  name: 'GoodsCategory',
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
        update: '编辑商品分类',
        create: '添加商品分类'
      },
      showData: '',
      listParams: {
        page: 1,
        size: 10,
        'name.contains': undefined
      },
      data: [],
      goodsCategoryTemp: {
        name: undefined,
        remark: undefined,
        image: undefined,
        showIndex: false,
        indexLayoutId: undefined,
        id: undefined
      },
      rules: {
        name: [{ required: true, message: '类别名称为必须参数', trigger: 'change' }]
      }
    }
  },
  created() {
    this.list()
  },
  methods: {
    list() {
      const params = {
        page: this.listParams.page,
        size: this.listParams.size,
        'name.equals': this.listParams['name.equals'] === '' ? undefined : this.listParams['name.equals'],
        'sort': this.listParams['sort'] === '' ? null : this.listParams['sort']
      }
      this.loading = true
      listGoodsCategory(params).then(response => {
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
    openDetails(row) {
      this.showData = row
      this.dialogDetailVisible = true
    },
    resetgoodsCategoryTemp() {
      this.goodsCategoryTemp = {
        name: undefined,
        remark: undefined,
        image: undefined,
        showIndex: false,
        indexLayoutId: undefined,
        id: undefined
      }
    },
    handleCreate() {
      this.resetgoodsCategoryTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['goodsCategoryForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['goodsCategoryForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          createGoodsCategory(this.goodsCategoryTemp).then(response => {
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
    handleUpdate(row) {
      Object.assign(this.goodsCategoryTemp, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['goodsCategoryForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['goodsCategoryForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          updateGoodsCategory(this.goodsCategoryTemp.id, this.goodsCategoryTemp).then(response => {
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
      this.$confirm('确认删除该商品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGoodsCategory(id).then(response => {
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
          '类别名称',
          '类别描述',
          '创建时间',
          '更新时间']
        const filterVal = ['id',
          'name',
          'desc',
          'createAt',
          'updateAt']
        const params = Object.assign({}, this.listParams)
        params.size = this.total
        listGoodsCategory(params).then(response => {
          this.exportList = response.data.data
          const data = this.formatJson(filterVal, this.exportList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '商品分类数据表格'
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
</style>
