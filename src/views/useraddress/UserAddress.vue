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
            <el-form-item label="收件人" label-width="80px">
              <el-input
                v-model="listParams['signerName.equals']"
                style="width: 100%;"
                class="filter-item"
                placeholder="收件人"
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="电话" label-width="80px">
              <el-input
                v-model="listParams['signerMobile.equals']"
                style="width: 100%;"
                class="filter-item"
                placeholder="电话"
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
        <el-table v-loading="loading" ref="UserAddressTable" :data="data" border fit highlight-current-row style="width: 100%;" @sort-change="sortSignTime" @row-dblclick="openDetails">
          <!-- 操作 -->
          <el-table-column :label="$t('table.actions')" align="center" width="80px" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="text" title="编辑" @click="handleUpdate(scope.row)"><i class="el-icon-edit"/></el-button>
              <el-button type="text" title="删除" @click="deleteData(scope.row.id)"><i class="el-icon-delete"/></el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" align="center" width="50"/>
          <el-table-column prop="country" label="商品数量" align="center">
            <template slot-scope="scope">
              {{ scope.row.country }}
            </template>
          </el-table-column>
          <el-table-column prop="province" label="省" align="center">
            <template slot-scope="scope">
              {{ scope.row.province }}
            </template>
          </el-table-column>
          <el-table-column prop="city" label="市" align="center">
            <template slot-scope="scope">
              {{ scope.row.city }}
            </template>
          </el-table-column>
          <el-table-column prop="county" label="县" align="center">
            <template slot-scope="scope">
              {{ scope.row.county }}
            </template>
          </el-table-column>
          <el-table-column prop="postalCode" label="邮编" align="center">
            <template slot-scope="scope">
              {{ scope.row.postalCode }}
            </template>
          </el-table-column>
          <el-table-column prop="addressDetail" label="详细地址" align="center">
            <template slot-scope="scope">
              {{ scope.row.addressDetail }}
            </template>
          </el-table-column>
          <el-table-column prop="isDefault" label="默认地址" align="center">
            <template slot-scope="scope">
              {{ scope.row.isDefault }}
            </template>
          </el-table-column>
          <el-table-column prop="areaCode" label="区域代码" align="center">
            <template slot-scope="scope">
              {{ scope.row.areaCode }}
            </template>
          </el-table-column>
          <el-table-column prop="signerName" label="收件人" align="center">
            <template slot-scope="scope">
              {{ scope.row.signerName }}
            </template>
          </el-table-column>
          <el-table-column prop="signerMobile" label="电话" align="center">
            <template slot-scope="scope">
              {{ scope.row.signerMobile }}
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
      <el-form ref="userAddressForm" :model="userAddressTemp" :rules="rules" class="form-add" label-width="100px" style="width: 100%; padding-left:10px;padding-right:10px">
        <el-form-item label="商品数量" prop="country">
          <el-input-number v-model="userAddressTemp.country" style="width:100%"/>
        </el-form-item>
        <el-form-item label="省" prop="province">
          <el-input v-model="userAddressTemp.province" style="width:100%"/>
        </el-form-item>
        <el-form-item label="市" prop="city">
          <el-input v-model="userAddressTemp.city" style="width:100%"/>
        </el-form-item>
        <el-form-item label="县" prop="county">
          <el-input v-model="userAddressTemp.county" style="width:100%"/>
        </el-form-item>
        <el-form-item label="邮编" prop="postalCode">
          <el-input v-model="userAddressTemp.postalCode" style="width:100%"/>
        </el-form-item>
        <el-form-item label="详细地址" prop="addressDetail">
          <el-input v-model="userAddressTemp.addressDetail" style="width:100%"/>
        </el-form-item>
        <el-form-item label="默认地址" prop="isDefault">
          <el-input v-model="userAddressTemp.isDefault" style="width:100%"/>
        </el-form-item>
        <el-form-item label="区域代码" prop="areaCode">
          <el-input v-model="userAddressTemp.areaCode" style="width:100%"/>
        </el-form-item>
        <el-form-item label="收件人" prop="signerName">
          <el-input v-model="userAddressTemp.signerName" style="width:100%"/>
        </el-form-item>
        <el-form-item label="电话" prop="signerMobile">
          <el-input v-model="userAddressTemp.signerMobile" style="width:100%"/>
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
        <el-form-item label="商品数量">
          <span> {{ showData.country }}</span>
        </el-form-item >
        <el-form-item label="省">
          <span> {{ showData.province }}</span>
        </el-form-item >
        <el-form-item label="市">
          <span> {{ showData.city }}</span>
        </el-form-item >
        <el-form-item label="县">
          <span> {{ showData.county }}</span>
        </el-form-item >
        <el-form-item label="邮编">
          <span> {{ showData.postalCode }}</span>
        </el-form-item >
        <el-form-item label="详细地址">
          <span> {{ showData.addressDetail }}</span>
        </el-form-item >
        <el-form-item label="默认地址">
          <span> {{ showData.isDefault }}</span>
        </el-form-item >
        <el-form-item label="区域代码">
          <span> {{ showData.areaCode }}</span>
        </el-form-item >
        <el-form-item label="收件人">
          <span> {{ showData.signerName }}</span>
        </el-form-item >
        <el-form-item label="电话">
          <span> {{ showData.signerMobile }}</span>
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
import { listUserAddress, createUserAddress, updateUserAddress, deleteUserAddress } from '@/api/UserAddressApi'
import waves from '@/directive/waves'
import { formatDate } from '@/utils'

export default {
  name: 'UserAddress',
  directives: {
    waves
  },
  props: {
    userId: {
      type: Number,
      default: undefined
    }
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
        update: '编辑用户收件地址',
        create: '添加用户收件地址'
      },
      showData: '',
      listParams: {
        page: 1,
        size: 10,
        'name.contains': undefined,
        'userId.equals': this.userId
      },
      data: [],
      userAddressTemp: {
        country: undefined,
        province: undefined,
        city: undefined,
        county: undefined,
        postalCode: undefined,
        addressDetail: undefined,
        isDefault: undefined,
        areaCode: undefined,
        signerName: undefined,
        signerMobile: undefined,
        id: undefined
      },
      rules: {
        province: [{ required: true, message: '省为必须参数', trigger: 'change' }],
        city: [{ required: true, message: '市为必须参数', trigger: 'change' }],
        county: [{ required: true, message: '县为必须参数', trigger: 'change' }],
        postalCode: [{ required: true, message: '邮编为必须参数', trigger: 'change' }],
        addressDetail: [{ required: true, message: '详细地址为必须参数', trigger: 'change' }],
        isDefault: [{ required: true, message: '默认地址为必须参数', trigger: 'change' }],
        areaCode: [{ required: true, message: '区域代码为必须参数', trigger: 'change' }],
        signerName: [{ required: true, message: '收件人为必须参数', trigger: 'change' }],
        signerMobile: [{ required: true, message: '电话为必须参数', trigger: 'change' }]
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
        'userId.equals': this.listParams['userId.equals'] === '' ? undefined : this.listParams['userId.equals'],
        'signerName.equals': this.listParams['signerName.equals'] === '' ? undefined : this.listParams['signerName.equals'],
        'signerMobile.equals': this.listParams['signerMobile.equals'] === '' ? undefined : this.listParams['signerMobile.equals'],
        'sort': this.listParams['sort'] === '' ? null : this.listParams['sort']
      }
      this.loading = true
      listUserAddress(params).then(response => {
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
    resetuserAddressTemp() {
      this.userAddressTemp = {
        country: undefined,
        province: undefined,
        city: undefined,
        county: undefined,
        postalCode: undefined,
        addressDetail: undefined,
        isDefault: undefined,
        areaCode: undefined,
        signerName: undefined,
        signerMobile: undefined,
        id: undefined
      }
    },
    handleCreate() {
      this.resetuserAddressTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['userAddressForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['userAddressForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          createUserAddress(this.userAddressTemp).then(response => {
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
      Object.assign(this.userAddressTemp, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['userAddressForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['userAddressForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          updateUserAddress(this.userAddressTemp.id, this.userAddressTemp).then(response => {
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
      this.$confirm('确认删除该用户收件地址, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserAddress(id).then(response => {
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
          '商品数量',
          '省',
          '市',
          '县',
          '邮编',
          '详细地址',
          '默认地址',
          '区域代码',
          '收件人',
          '电话',
          '创建时间',
          '更新时间']
        const filterVal = ['id',
          'country',
          'province',
          'city',
          'county',
          'postalCode',
          'addressDetail',
          'isDefault',
          'areaCode',
          'signerName',
          'signerMobile',
          'createAt',
          'updateAt']
        const params = Object.assign({}, this.listParams)
        params.size = this.total
        listUserAddress(params).then(response => {
          this.exportList = response.data.data
          const data = this.formatJson(filterVal, this.exportList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '用户收件地址数据表格'
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
