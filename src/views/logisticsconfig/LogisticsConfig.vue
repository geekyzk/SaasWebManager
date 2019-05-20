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
            <el-form-item label="物流接口类型" label-width="80px">
              <el-input
                v-model="listParams['type.equals']"
                style="width: 100%;"
                class="filter-item"
                placeholder="物流接口类型"
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="默认配置" label-width="80px">
              <el-input
                v-model="listParams['isDefault.equals']"
                style="width: 100%;"
                class="filter-item"
                placeholder="默认配置"
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
        <el-table v-loading="loading" ref="LogisticsConfigTable" :data="data" border fit highlight-current-row style="width: 100%;" @sort-change="sortSignTime" @row-dblclick="openDetails">
          <!-- 操作 -->
          <el-table-column :label="$t('table.actions')" align="center" width="80px" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="text" title="编辑" @click="handleUpdate(scope.row)"><i class="el-icon-edit"/></el-button>
              <el-button type="text" title="删除" @click="deleteData(scope.row.id)"><i class="el-icon-delete"/></el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" align="center" width="50"/>
          <el-table-column :sortable="'custom'" prop="apiHost" label="api地址" align="center">
            <template slot-scope="scope">
              {{ scope.row.apiHost }}
            </template>
          </el-table-column>
          <el-table-column :sortable="'custom'" prop="appCode" label="app_code" align="center">
            <template slot-scope="scope">
              {{ scope.row.appCode }}
            </template>
          </el-table-column>
          <el-table-column :sortable="'custom'" prop="appKey" label="app_key" align="center">
            <template slot-scope="scope">
              {{ scope.row.appKey }}
            </template>
          </el-table-column>
          <el-table-column :sortable="'custom'" prop="appSecret" label="app_secret" align="center">
            <template slot-scope="scope">
              {{ scope.row.appSecret }}
            </template>
          </el-table-column>
          <el-table-column :sortable="'custom'" prop="type" label="物流接口类型" align="center">
            <template slot-scope="scope">
              {{ scope.row.type }}
            </template>
          </el-table-column>
          <el-table-column :sortable="'custom'" prop="isDefault" label="默认配置" align="center">
            <template slot-scope="scope">
              {{ scope.row.isDefault }}
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
      <el-form ref="logisticsConfigForm" :model="logisticsConfigTemp" :rules="rules" class="form-add" label-width="100px" style="width: 100%; padding-left:10px;padding-right:10px">
        <el-form-item label="api地址" prop="apiHost">
          <el-input v-model="logisticsConfigTemp.apiHost" style="width:100%"/>
        </el-form-item>
        <el-form-item label="app_code" prop="appCode">
          <el-input v-model="logisticsConfigTemp.appCode" style="width:100%"/>
        </el-form-item>
        <el-form-item label="app_key" prop="appKey">
          <el-input v-model="logisticsConfigTemp.appKey" style="width:100%"/>
        </el-form-item>
        <el-form-item label="app_secret" prop="appSecret">
          <el-input v-model="logisticsConfigTemp.appSecret" style="width:100%"/>
        </el-form-item>
        <el-form-item label="物流接口类型" prop="type">
          <el-input v-model="logisticsConfigTemp.type" style="width:100%"/>
        </el-form-item>
        <el-form-item label="默认配置" prop="isDefault">
          <el-input v-model="logisticsConfigTemp.isDefault" style="width:100%"/>
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
        <el-form-item label="api地址">
          <span> {{ showData.apiHost }}</span>
        </el-form-item >
        <el-form-item label="app_code">
          <span> {{ showData.appCode }}</span>
        </el-form-item >
        <el-form-item label="app_key">
          <span> {{ showData.appKey }}</span>
        </el-form-item >
        <el-form-item label="app_secret">
          <span> {{ showData.appSecret }}</span>
        </el-form-item >
        <el-form-item label="物流接口类型">
          <span> {{ showData.type }}</span>
        </el-form-item >
        <el-form-item label="默认配置">
          <span> {{ showData.isDefault }}</span>
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
import { listLogisticsConfig, createLogisticsConfig, updateLogisticsConfig, deleteLogisticsConfig } from '@/api/LogisticsConfigApi'
import waves from '@/directive/waves'
import { formatDate } from '@/utils'

export default {
  name: 'LogisticsConfig',
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
        update: '编辑物流信息配置',
        create: '添加物流信息配置'
      },
      showData: '',
      listParams: {
        page: 1,
        size: 10,
        'name.contains': undefined
      },
      data: [],
      logisticsConfigTemp: {
        apiHost: undefined,
        appCode: undefined,
        appKey: undefined,
        appSecret: undefined,
        type: undefined,
        isDefault: undefined,
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
        'type.equals': this.listParams['type.equals'] === '' ? undefined : this.listParams['type.equals'],
        'isDefault.equals': this.listParams['isDefault.equals'] === '' ? undefined : this.listParams['isDefault.equals'],
        'sort': this.listParams['sort'] === '' ? null : this.listParams['sort']
      }
      this.loading = true
      listLogisticsConfig(params).then(response => {
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
    resetlogisticsConfigTemp() {
      this.logisticsConfigTemp = {
        apiHost: undefined,
        appCode: undefined,
        appKey: undefined,
        appSecret: undefined,
        type: undefined,
        isDefault: undefined,
        id: undefined
      }
    },
    handleCreate() {
      this.resetlogisticsConfigTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['logisticsConfigForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['logisticsConfigForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          createLogisticsConfig(this.logisticsConfigTemp).then(response => {
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
      Object.assign(this.logisticsConfigTemp, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['logisticsConfigForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['logisticsConfigForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          updateLogisticsConfig(this.logisticsConfigTemp.id, this.logisticsConfigTemp).then(response => {
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
      this.$confirm('确认删除该物流信息配置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLogisticsConfig(id).then(response => {
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
          'api地址',
          'app_code',
          'app_key',
          'app_secret',
          '物流接口类型',
          '默认配置',
          '创建时间',
          '更新时间']
        const filterVal = ['id',
          'apiHost',
          'appCode',
          'appKey',
          'appSecret',
          'type',
          'isDefault',
          'createAt',
          'updateAt']
        const params = Object.assign({}, this.listParams)
        params.size = this.total
        listLogisticsConfig(params).then(response => {
          this.exportList = response.data.data
          const data = this.formatJson(filterVal, this.exportList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '物流信息配置数据表格'
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
