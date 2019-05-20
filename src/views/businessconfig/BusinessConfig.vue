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
            <el-form-item label="商家名称" label-width="80px">
              <el-input
                v-model="listParams['name.equals']"
                style="width: 100%;"
                class="filter-item"
                placeholder="商家名称"
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="商家代码" label-width="80px">
              <el-input
                v-model="listParams['code.equals']"
                style="width: 100%;"
                class="filter-item"
                placeholder="商家代码"
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
        <el-table v-loading="loading" ref="BusinessConfigTable" :data="data" border fit highlight-current-row style="width: 100%;" @sort-change="sortSignTime" @row-dblclick="openDetails">
          <!-- 操作 -->
          <el-table-column :label="$t('table.actions')" align="center" width="80px" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="text" title="编辑" @click="handleUpdate(scope.row)"><i class="el-icon-edit"/></el-button>
              <el-button type="text" title="删除" @click="deleteData(scope.row.id)"><i class="el-icon-delete"/></el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" align="center" width="50"/>
          <el-table-column :sortable="'custom'" prop="name" label="商家名称" align="center">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column :sortable="'custom'" prop="shopName" label="商家店铺名称" align="center">
            <template slot-scope="scope">
              {{ scope.row.shopName }}
            </template>
          </el-table-column>
          <el-table-column :sortable="'custom'" prop="logo" label="店铺LOGO" align="center">
            <template slot-scope="scope">
              {{ scope.row.logo }}
            </template>
          </el-table-column>
          <el-table-column :sortable="'custom'" prop="code" label="商家代码" align="center">
            <template slot-scope="scope">
              {{ scope.row.code }}
            </template>
          </el-table-column>
          <el-table-column :sortable="'custom'" prop="createAt" label="创建时间" align="center">
            <template slot-scope="scope">
              {{ scope.row.createAt | formatDate }}
            </template>
          </el-table-column>
          <el-table-column :sortable="'custom'" prop="updateAt" label="更新时间" align="center">
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
      <el-form ref="businessConfigForm" :model="businessConfigTemp" :rules="rules" class="form-add" label-width="100px" style="width: 100%; padding-left:10px;padding-right:10px">
        <el-form-item label="商家名称" prop="name">
          <el-input v-model="businessConfigTemp.name" style="width:100%"/>
        </el-form-item>
        <el-form-item label="商家店铺名称" prop="shopName">
          <el-input v-model="businessConfigTemp.shopName" style="width:100%"/>
        </el-form-item>
        <el-form-item label="店铺LOGO" prop="logo">
          <el-input v-model="businessConfigTemp.logo" style="width:100%"/>
        </el-form-item>
        <el-form-item label="商家代码" prop="code">
          <el-input v-model="businessConfigTemp.code" style="width:100%"/>
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
        <el-form-item label="商家名称">
          <span> {{ showData.name }}</span>
        </el-form-item >
        <el-form-item label="商家店铺名称">
          <span> {{ showData.shopName }}</span>
        </el-form-item >
        <el-form-item label="店铺LOGO">
          <span> {{ showData.logo }}</span>
        </el-form-item >
        <el-form-item label="商家代码">
          <span> {{ showData.code }}</span>
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
import { listBusinessConfig, createBusinessConfig, updateBusinessConfig, deleteBusinessConfig } from '@/api/BusinessConfigApi'
import waves from '@/directive/waves'
import { formatDate } from '@/utils'

export default {
  name: 'BusinessConfig',
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
        update: '编辑商家配置信息',
        create: '添加商家配置信息'
      },
      showData: '',
      listParams: {
        page: 1,
        size: 10,
        'name.contains': undefined
      },
      data: [],
      businessConfigTemp: {
        name: undefined,
        shopName: undefined,
        logo: undefined,
        code: undefined,
        id: undefined
      },
      rules: {
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
        'code.equals': this.listParams['code.equals'] === '' ? undefined : this.listParams['code.equals'],
        'sort': this.listParams['sort'] === '' ? null : this.listParams['sort']
      }
      this.loading = true
      listBusinessConfig(params).then(response => {
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
    resetbusinessConfigTemp() {
      this.businessConfigTemp = {
        name: undefined,
        shopName: undefined,
        logo: undefined,
        code: undefined,
        id: undefined
      }
    },
    handleCreate() {
      this.resetbusinessConfigTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['businessConfigForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['businessConfigForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          createBusinessConfig(this.businessConfigTemp).then(response => {
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
      Object.assign(this.businessConfigTemp, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['businessConfigForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['businessConfigForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          updateBusinessConfig(this.businessConfigTemp.id, this.businessConfigTemp).then(response => {
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
      this.$confirm('确认删除该商家配置信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBusinessConfig(id).then(response => {
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
          '商家名称',
          '商家店铺名称',
          '店铺LOGO',
          '商家代码',
          '创建时间',
          '更新时间']
        const filterVal = ['id',
          'name',
          'shopName',
          'logo',
          'code',
          'createAt',
          'updateAt']
        const params = Object.assign({}, this.listParams)
        params.size = this.total
        listBusinessConfig(params).then(response => {
          this.exportList = response.data.data
          const data = this.formatJson(filterVal, this.exportList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '商家配置信息数据表格'
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
