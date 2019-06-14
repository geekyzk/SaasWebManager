<template>
  <div class="app-container">
    <!-- 查询参数过滤 -->
    <div class="filter-container">
      <el-row :gutter="10">
        <el-form>
          <el-col :span="2">
            <el-button class="filter-item" style="width:100%;padding: 10px 0px;"  @click="handleCreate" type="primary" icon="el-icon-plus">{{$t('table.add')}}</el-button>
          </el-col>
          <el-col :span="2">
            <el-button :disabled="total == 0" type="primary" style="width:100%;padding: 10px 0px;" :loading="downloadLoading"  icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
          </el-col>
          <el-col :span="2">
            <el-button class="filter-item" style="width:100%;padding: 10px 0px;"  type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <el-row>
      <div class='chart-container'>
        <el-table ref="CouponTable" :data="data" @sort-change="sortSignTime" v-loading="loading" @row-dblclick="openDetails" border fit highlight-current-row style="width: 100%;">
          <!-- 操作 -->
          <el-table-column align="center" :label="$t('table.actions')" width="80px" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="text" title="编辑"  @click="handleUpdate(scope.row)"><i class="el-icon-edit"></i></el-button>
              <el-button type="text" title="删除"  @click="deleteData(scope.row.id)"><i class="el-icon-delete"></i></el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" align="center" width="50"></el-table-column>
          <el-table-column prop="name" label="名称" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column prop="code" label="优惠吗" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              {{ scope.row.code }}
            </template>
          </el-table-column>
          <el-table-column prop="isUsed" label="已使用" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              {{ scope.row.isUsed }}
            </template>
          </el-table-column>
          <el-table-column prop="startDate" label="开始时间" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              {{ scope.row.startDate | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="endDate" label="结束时间" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              {{ scope.row.endDate | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类别" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              {{ scope.row.type }}
            </template>
          </el-table-column>
          <el-table-column prop="goodsId" label="商品" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              {{ scope.row.goodsId }}
            </template>
          </el-table-column>
          <el-table-column prop="categoryId" label="类别" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              {{ scope.row.categoryId }}
            </template>
          </el-table-column>
          <el-table-column prop="minPrice" label="使用价格" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              {{ scope.row.minPrice }}
            </template>
          </el-table-column>
          <el-table-column prop="divPrice" label="优惠价格" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              {{ scope.row.divPrice }}
            </template>
          </el-table-column>
          <el-table-column prop="createAt" label="创建时间" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              {{ scope.row.createAt | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="updateAt" label="更新时间" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              {{ scope.row.updateAt | formatDate }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listParams.page"
          :page-sizes="pageSize" :page-size="listParams.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-row>

    <!-- 对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="48%" top="7vh">
      <el-form class="form-add" :model="couponTemp" :rules="rules" ref="couponForm" label-width="100px" style="width: 100%; padding-left:10px;padding-right:10px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="couponTemp.name" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="优惠吗" prop="code">
          <el-input v-model="couponTemp.code" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="已使用" prop="isUsed">
          <el-switch
            v-model="couponTemp.isUsed"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="开始时间" prop="startDate">
          <el-date-picker
            v-model="couponTemp.startDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker
            v-model="couponTemp.endDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="类别" prop="type">
          <el-input v-model="couponTemp.type" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="商品" prop="goodsId">
          <el-input v-model="couponTemp.goodsId" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="categoryId">
          <el-input v-model="couponTemp.categoryId" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="使用价格" prop="minPrice">
          <el-input-number v-model="couponTemp.minPrice" style="width:100%"></el-input-number>
        </el-form-item>
        <el-form-item label="优惠价格" prop="divPrice">
          <el-input-number v-model="couponTemp.divPrice" style="width:100%"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :loading="buttonLoading">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" :loading="buttonLoading" @click="updateData">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogDetailVisible" title="详情" width="40%" top="7vh" style="width: 100%; padding-left:10px;padding-right:10px">
      <el-form ref="form" :model="showData" label-width="90px" label-position="left" style="padding-left: 20px">
        <el-form-item label="名称">
          <span> {{ showData.name }}</span>
        </el-form-item >
        <el-form-item label="优惠吗">
          <span> {{ showData.code }}</span>
        </el-form-item >
        <el-form-item label="已使用">
          <span> {{ showData.isUsed }}</span>
        </el-form-item >
        <el-form-item label="开始时间">
          <span> {{ showData.startDate }}</span>
        </el-form-item >
        <el-form-item label="结束时间">
          <span> {{ showData.endDate }}</span>
        </el-form-item >
        <el-form-item label="类别">
          <span> {{ showData.type }}</span>
        </el-form-item >
        <el-form-item label="商品">
          <span> {{ showData.goodsId }}</span>
        </el-form-item >
        <el-form-item label="类别">
          <span> {{ showData.categoryId }}</span>
        </el-form-item >
        <el-form-item label="使用价格">
          <span> {{ showData.minPrice }}</span>
        </el-form-item >
        <el-form-item label="优惠价格">
          <span> {{ showData.divPrice }}</span>
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
import { listCoupon, createCoupon, updateCoupon, deleteCoupon } from '@/api/CouponApi'
import waves from '@/directive/waves'
import { formatDate } from '@/utils'

export default {
  name: 'Coupon',
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
        update: '编辑优惠券',
        create: '添加优惠券'
      },
      showData: '',
      listParams: {
        page: 1,
        size: 10,
        'name.contains': undefined
      },
      data: [],
      couponTemp: {
        name: undefined,
        code: undefined,
        isUsed: undefined,
        startDate: undefined,
        endDate: undefined,
        type: undefined,
        goodsId: undefined,
        categoryId: undefined,
        minPrice: undefined,
        divPrice: undefined,
        id: undefined
      },
      rules: {
        name: [{ required: true, message: '名称为必须参数', trigger: 'change' }],
        code: [{ required: true, message: '优惠吗为必须参数', trigger: 'change' }],
        isUsed: [{ required: true, message: '已使用为必须参数', trigger: 'change' }],
        startDate: [{ required: true, message: '开始时间为必须参数', trigger: 'change' }],
        endDate: [{ required: true, message: '结束时间为必须参数', trigger: 'change' }],
        type: [{ required: true, message: '类别为必须参数', trigger: 'change' }],
        goodsId: [{ required: true, message: '商品为必须参数', trigger: 'change' }],
        categoryId: [{ required: true, message: '类别为必须参数', trigger: 'change' }],
        minPrice: [{ required: true, message: '使用价格为必须参数', trigger: 'change' }],
        divPrice: [{ required: true, message: '优惠价格为必须参数', trigger: 'change' }],
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
        'sort': this.listParams['sort'] === '' ? null : this.listParams['sort']
      }
      this.loading = true
      listCoupon(params).then(response => {
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
    resetcouponTemp() {
      this.couponTemp = {
        name: undefined,
        code: undefined,
        isUsed: undefined,
        startDate: undefined,
        endDate: undefined,
        type: undefined,
        goodsId: undefined,
        categoryId: undefined,
        minPrice: undefined,
        divPrice: undefined,
        id: undefined
      }
    },
    handleCreate() {
      this.resetcouponTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['couponForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['couponForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          createCoupon(this.couponTemp).then(response => {
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
      Object.assign(this.couponTemp, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['couponForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['couponForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          updateCoupon(this.couponTemp.id, this.couponTemp).then(response => {
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
      this.$confirm('确认删除该优惠券, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCoupon(id).then(response => {
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
          '优惠吗',
          '已使用',
          '开始时间',
          '结束时间',
          '类别',
          '商品',
          '类别',
          '使用价格',
          '优惠价格',
          '创建时间',
          '更新时间']
        const filterVal = ['id',
          'name',
          'code',
          'isUsed',
          'startDate',
          'endDate',
          'type',
          'goodsId',
          'categoryId',
          'minPrice',
          'divPrice',
          'createAt',
          'updateAt']
        const params = Object.assign({}, this.listParams)
        params.size = this.total
        listCoupon(params).then(response => {
          this.exportList = response.data.data
          const data = this.formatJson(filterVal, this.exportList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '优惠券数据表格'
          })
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createAt' || j === 'updateAt') {
          return formatDate(v[j])
        }else if (j === 'startDate'){
          return formatDate(v[j])
        }else if (j === 'endDate'){
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
