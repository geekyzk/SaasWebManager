<template>
  <div class="app-container">
    <!-- 查询参数过滤 -->
    <div class="filter-container" style="margin-bottom: 30px;">
      <el-row :gutter="10">
        <el-form>
          <el-col :span="2">
            <el-button class="filter-item" style="width:100%;padding: 10px 0px;" type="primary" icon="el-icon-plus" @click="handleCreate">{{ $t('table.add') }}</el-button>
          </el-col>
          <el-col :span="2">
            <el-button :disabled="total == 0" :loading="downloadLoading" type="primary" style="width:100%;padding: 10px 0px;" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
          </el-col>
          <el-col :span="2">
            <el-button v-waves class="filter-item" style="width:100%;padding: 10px 0px;" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <el-row>
      <div class="chart-container">
        <el-table v-loading="loading" ref="UserTable" :data="data" border fit highlight-current-row style="width: 100%;" @sort-change="sortSignTime">
          <!-- 操作 -->
          <el-table-column :label="$t('table.actions')" align="center" width="120px" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="text" title="编辑" @click="handleUpdate(scope.row)"><i class="el-icon-edit"/></el-button>
              <el-button :disabled="!hasBusinessAdmin" type="text" title="修改密码" @click="handleChangePassword(scope.row.id)"><i class="el-icon-key"/></el-button>
              <el-button type="text" title="删除" @click="deleteData(scope.row.id)"><i class="el-icon-delete"/></el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" align="center" width="50"/>
          <el-table-column prop="nickName" label="昵称" align="center" >
            <template slot-scope="scope">
              {{ scope.row.nickName }}
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机" align="center" >
            <template slot-scope="scope">
              {{ scope.row.phone }}
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" align="center" >
            <template slot-scope="scope">
              {{ scope.row.email }}
            </template>
          </el-table-column>
          <el-table-column prop="activated" label="激活" align="center" >
            <template slot-scope="scope">
              <BooleanTag :tag-value="scope.row.activated"/>
            </template>
          </el-table-column>
          <el-table-column prop="imageUrl" label="头像" align="center" >
            <template slot-scope="scope">
              <img :src="scope.row.imageUrl" alt="" style="width:50px;height:50px;">
            </template>
          </el-table-column>
          <el-table-column prop="isBusinessAdmin" label="超级管理员" align="center" >
            <template slot-scope="scope">
              <BooleanTag :tag-value="scope.row.isBusinessAdmin"/>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="userType" label="用户类型" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              {{ scope.row.userType }}
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="openId" label="微信OpenId" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              {{ scope.row.openId }}
            </template>
          </el-table-column> -->
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
      <el-form ref="userForm" :model="userTemp" :rules="rules" class="form-add" label-width="100px" style="width: 100%; padding-left:10px;padding-right:10px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="userTemp.nickName" style="width:100%"/>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model="userTemp.phone" style="width:100%"/>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userTemp.email" style="width:100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头像" prop="imageUrl">
              <ImageUpload v-model="userTemp.imageUrl"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="角色">
          <el-select v-model="userTemp.roleIds" multiple style="width: 100%">
            <el-option v-for="item in roleData" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <!-- <el-input v-model="userTemp.roleIds" style="width:100%"></el-input> -->
        </el-form-item>
        <el-form-item v-show="dialogStatus=== 'create'" label="密码">
          <el-input v-model="userTemp.password" style="width:100%"/>
        </el-form-item>

        <el-form-item label="激活状态" prop="activated">
          <el-switch
            v-model="userTemp.activated"
            active-text="激活"
            inactive-text="禁用"/>
        </el-form-item>
        <el-form-item label="超级管理员" prop="activated">
          <el-switch
            v-model="userTemp.isBusinessAdmin"
            active-text="是"
            inactive-text="否"/>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" :loading="buttonLoading" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else :loading="buttonLoading" type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="'密码修改'" :visible.sync="dialogChangePasswordVisible" width="48%" top="7vh">
      <el-form ref="changePasswordForm" :model="changePasswordTemp" class="form-add" label-width="100px" style="width: 100%; padding-left:10px;padding-right:10px">
        <el-form-item label="密码" required>
          <el-input v-model="changePasswordTemp.newPassword" style="width:100%"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChangePasswordVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button :loading="buttonLoading" type="primary" @click="doChangePassword">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogDetailVisible" title="详情" width="40%" top="7vh" style="width: 100%; padding-left:10px;padding-right:10px">
      <el-form ref="form" :model="showData" label-width="90px" label-position="left" style="padding-left: 20px">
        <el-form-item label="昵称">
          <span> {{ showData.nickName }}</span>
        </el-form-item >
        <el-form-item label="密码">
          <span> {{ showData.password }}</span>
        </el-form-item >
        <el-form-item label="手机">
          <span> {{ showData.phone }}</span>
        </el-form-item >
        <el-form-item label="邮箱">
          <span> {{ showData.email }}</span>
        </el-form-item >
        <el-form-item label="激活状态">
          <span> {{ showData.activated }}</span>
        </el-form-item >
        <el-form-item label="头像">
          <span> {{ showData.imageUrl }}</span>
        </el-form-item >
        <el-form-item label="商铺管理员">
          <span> {{ showData.isBusinessAdmin }}</span>
        </el-form-item >
        <el-form-item label="用户类型">
          <span> {{ showData.userType }}</span>
        </el-form-item >
        <el-form-item label="微信OpenId">
          <span> {{ showData.openId }}</span>
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
import { listUser, createUser, updateUser, deleteUser, changePassword } from '@/api/UserApi'
import { listRole } from '@/api/RoleApi'
import waves from '@/directive/waves'
import { formatDate } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'User',
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
      dialogChangePasswordVisible: false,
      total: null,
      dialogStatus: '',
      textMap: {
        update: '编辑用户管理',
        create: '添加用户管理'
      },
      showData: '',
      listParams: {
        page: 1,
        size: 10,
        'name.contains': undefined,
        'userType.equals': 'ADMIN'
      },
      data: [],
      userTemp: {
        nickName: undefined,
        password: undefined,
        phone: undefined,
        email: undefined,
        activated: false,
        imageUrl: undefined,
        isBusinessAdmin: false,
        userType: undefined,
        openId: undefined,
        roleIds: [],
        id: undefined
      },
      changePasswordTemp: {
        userId: undefined,
        newPassword: undefined
      },
      roleData: [],
      rules: {
        nickName: [{ required: true, message: '昵称为必须参数', trigger: 'change' }],
        password: [{ required: true, message: '密码为必须参数', trigger: 'change' }],
        phone: [{ required: true, message: '手机为必须参数', trigger: 'change' }],
        email: [{ required: true, message: '邮箱为必须参数', trigger: 'change' }],
        activated: [{ required: true, message: '激活状态为必须参数', trigger: 'change' }],
        imageUrl: [{ required: true, message: '头像为必须参数', trigger: 'change' }],
        isBusinessAdmin: [{ required: true, message: '商铺管理员为必须参数', trigger: 'change' }],
        userType: [{ required: true, message: '用户类型为必须参数', trigger: 'change' }],
        openId: [{ required: true, message: '微信OpenId为必须参数', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters(['checkUserPermissions'])
  },
  created() {
    this.list()
  },
  methods: {
    list() {
      
      const params = {
        page: this.listParams.page,
        size: this.listParams.size,
        'sort': this.listParams['sort'] === '' ? null : this.listParams['sort'],
        'userType.equals': this.listParams['userType.equals'] === '' ? null : this.listParams['userType.equals']
      }
      this.loading = true
      listUser(params).then(response => {
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
    initRoleList() {
      if (this.store.getter('QUERY_ROLE')) {
        listRole({ size: 100 }).then(resp => {
          this.roleData = resp.data.data
        })
      }
      
    },
    resetuserTemp() {
      this.userTemp = {
        nickName: undefined,
        password: undefined,
        phone: undefined,
        email: undefined,
        activated: false,
        imageUrl: undefined,
        isBusinessAdmin: false,
        userType: 'ADMIN',
        openId: undefined,
        roleIds: [],
        id: undefined
      }
    },
    handleCreate() {
      this.resetuserTemp()
      this.dialogStatus = 'create'
      this.initRoleList()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['userForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          createUser(this.userTemp).then(response => {
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
      Object.assign(this.userTemp, row)
      console.log(row.roles)
      this.userTemp.roleIds = row.roles.map(item => {
        console.log(item)
        return item.id
      })
      this.dialogStatus = 'update'
      this.initRoleList()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['userForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          delete this.userTemp['roles']
          updateUser(this.userTemp.id, this.userTemp).then(response => {
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
      this.$confirm('确认删除该用户管理, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(id).then(response => {
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
    handleChangePassword(id) {
      this.changePasswordTemp.userId = id
      this.dialogChangePasswordVisible = true
      this.$nextTick(() => {
        this.$refs['changePasswordForm'].clearValidate()
      })
    },
    doChangePassword() {
      this.$refs['changePasswordForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          changePassword(this.changePasswordTemp).then(response => {
            this.buttonLoading = false
            if (response.data.code === -1) {
              this.$message({
                title: '失败',
                message: response.data.message,
                type: 'error'
              })
            } else {
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
          '昵称',
          '密码',
          '手机',
          '邮箱',
          '激活状态',
          '头像',
          '商铺管理员',
          '用户类型',
          '微信OpenId',
          '创建时间',
          '更新时间']
        const filterVal = ['id',
          'nickName',
          'password',
          'phone',
          'email',
          'activated',
          'imageUrl',
          'isBusinessAdmin',
          'userType',
          'openId',
          'createAt',
          'updateAt']
        const params = Object.assign({}, this.listParams)
        params.size = this.total
        listUser(params).then(response => {
          this.exportList = response.data.data
          const data = this.formatJson(filterVal, this.exportList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '用户管理数据表格'
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
