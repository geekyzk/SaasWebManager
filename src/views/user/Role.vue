<template>
  <div class="app-container">
    <!-- 查询参数过滤 -->
    <div class="filter-container" style="margin-bottom:40px">
      <el-row :gutter="10">
        <el-form>
          <el-col :span="2">
            <el-button class="filter-item" style="width:100%;padding: 10px 0px;" type="primary" icon="el-icon-plus" @click="handleCreate">{{ $t('table.add') }}</el-button>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <el-row>
      <div class="chart-container">
        <el-table v-loading="loading" ref="RoleTable" :data="data" border fit highlight-current-row style="width: 100%;" @sort-change="sortSignTime" @row-dblclick="openDetails">
          <!-- 操作 -->
          <el-table-column :label="$t('table.actions')" align="center" width="80px" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="text" title="编辑" @click="handleUpdate(scope.row)"><i class="el-icon-edit"/></el-button>
              <el-button type="text" title="删除" @click="deleteData(scope.row.id)"><i class="el-icon-delete"/></el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" align="center" width="50"/>
          <el-table-column :sortable="'custom'" prop="name" label="名称" align="center">
            <template slot-scope="scope">
              {{ scope.row.name }}
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

      <el-form ref="roleForm" :model="roleTemp" :rules="rules" class="form-add" label-width="100px" style="width: 100%; padding-left:10px;padding-right:10px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="roleTemp.name" style="width:100%"/>
        </el-form-item>
        <el-form-item label="权限" prop="name">
          <el-select v-model="roleTemp.permissionIds" multiple style="width:100%">
            <el-option v-for="item in permissionData" :key="item.id" :value="item.id" :label="item.label"/>
          </el-select>
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
        <el-form-item label="名称">
          <span> {{ showData.name }}</span>
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
import { listRole, createRole, updateRole, deleteRole, retriveRole } from '@/api/RoleApi'
import { listFormatPermission } from '@/api/PermissionApi'
import waves from '@/directive/waves'
import { formatDate } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'Role',
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
        update: '编辑角色管理',
        create: '添加角色管理'
      },
      showData: '',
      listParams: {
        page: 1,
        size: 10,
        'name.contains': undefined
      },
      filterText: '',
      data: [],
      roleTemp: {
        name: undefined,
        id: undefined,
        permissionIds: []
      },
      permissionData: [],
      rules: {
        name: [{ required: true, message: '名称为必须参数', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters(['hasBusinessAdmin'])
  },
  created() {
    this.list()
    this.initPermissionData()
  },
  methods: {
    list() {
      const params = {
        page: this.listParams.page,
        size: this.listParams.size,
        'sort': this.listParams['sort'] === '' ? null : this.listParams['sort']
      }
      this.loading = true
      listRole(params).then(response => {
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
    resetroleTemp() {
      this.roleTemp = {
        name: undefined,
        id: undefined,
        permissionIds: []
      }
    },
    handleCreate() {
      this.resetroleTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['roleForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          createRole(this.roleTemp).then(response => {
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
    initPermissionData() {
      listFormatPermission({ format: false }).then(resp => {
        this.permissionData = resp.data.data
      })
    },
    handleUpdate(row) {
      retriveRole(row.id).then(resp => {
        const retriveData = resp.data
        this.roleTemp = {
          name: retriveData.name,
          id: retriveData.id,
          permissionIds: retriveData.permissions.map(item => {
            return item.id
          })
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['roleForm'].clearValidate()
        })
      })
    },
    updateData() {
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          updateRole(this.roleTemp.id, this.roleTemp).then(response => {
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
      this.$confirm('确认删除该角色管理, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(id).then(response => {
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
          '名称',
          '创建时间',
          '更新时间']
        const filterVal = ['id',
          'name',
          'createAt',
          'updateAt']
        const params = Object.assign({}, this.listParams)
        params.size = this.total
        listRole(params).then(response => {
          this.exportList = response.data.data
          const data = this.formatJson(filterVal, this.exportList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '角色管理数据表格'
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
