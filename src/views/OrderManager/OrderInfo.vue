<template>
  <div class="app-container">
    <!-- 查询参数过滤 -->
    <div class="filter-container">
      <el-row :gutter="10">
        <el-form>
          <!-- <el-col :span="2">
            <el-button class="filter-item" style="width:100%;padding: 10px 0px;" type="primary" icon="el-icon-plus" @click="handleCreate">{{ $t('table.add') }}</el-button>
          </el-col> -->
          <!-- <el-col :span="2">
            <el-button :disabled="total == 0" :loading="downloadLoading" type="primary" style="width:100%;padding: 10px 0px;" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
          </el-col> -->
          <el-col :span="4">
            <el-form-item label="订单号" label-width="80px">
              <el-input
                v-model="listParams['orderSn.contains']"
                style="width: 100%;"
                class="filter-item"
                placeholder="订单号"
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="交易号" label-width="80px">
              <el-input
                v-model="listParams['tradeNo.contains']"
                style="width: 100%;"
                class="filter-item"
                placeholder="交易号"
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="订单状态" label-width="80px">
              <el-select v-model="listParams['payStatus.equals']" clearable @keyup.enter.native="handleFilter">
                <el-option v-for="(value, key) in orderStatusMaps" :key="key" :value="key" :label="value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="签收人" label-width="80px">
              <el-input
                v-model="listParams['signerName.equals']"
                style="width: 100%;"
                class="filter-item"
                placeholder="签收人"
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
        <el-table v-loading="loading" ref="OrderInfoTable" :data="data" border fit highlight-current-row style="width: 100%;" @sort-change="sortSignTime">
          <!-- 操作 -->
          <el-table-column :label="$t('table.actions')" align="center" width="80px" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="text" title="编辑" @click="handleUpdate(scope.row)"><i class="el-icon-edit"/></el-button>
              <el-button type="text" title="删除" @click="deleteData(scope.row.id)"><i class="el-icon-delete"/></el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" align="center" width="50"/>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="签收人">
                      <span>{{ props.row.signerName }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="电话">
                      <span>{{ props.row.signerMobile }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="地址" style="width:100%">
                      <span>{{ props.row.address }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="提货方式">
                      <span>{{ shipMethodMaps[props.row.shipMethod] }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col v-show="props.row.shipMethod === '0'" :span="8">
                    <el-form-item label="快递信息" style="width:100%">
                      <span>{{ logisticsTypeMaps[props.row.logisticsType] }}({{ props.row.logisticsNo }})</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-table :data="props.row.orderGoods" style="width: 100%;">
                <el-table-column prop="orderSn" label="名称" align="center">
                  <template slot-scope="itemScope">
                    {{ itemScope.row.name }}
                  </template>
                </el-table-column>
                <el-table-column prop="orderSn" label="简介" align="center">
                  <template slot-scope="itemScope">
                    {{ itemScope.row.goodsBrief }}
                  </template>
                </el-table-column>
                <el-table-column prop="orderSn" label="照片" align="center">
                  <template slot-scope="itemScope">
                    <img :src="itemScope.row.showImage" style="width:50px;height:50px;" alt="">
                  </template>
                </el-table-column>
                <el-table-column prop="orderSn" label="商品价格" align="center">
                  <template slot-scope="itemScope">
                    {{ formatPrice(itemScope.row.goodsNum) }}
                  </template>
                </el-table-column>
                <el-table-column prop="orderSn" label="商品数量" align="center">
                  <template slot-scope="itemScope">
                    {{ itemScope.row.goodsNum }}
                  </template>
                </el-table-column>
                <el-table-column prop="orderSn" label="总价" align="center">
                  <template slot-scope="itemScope">
                    {{ formatPrice(itemScope.row.goodsNum * itemScope.row.goodsNum) }}
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="orderSn" label="客户微信昵称" width="120" align="center">
            <template slot-scope="scope">
              {{ scope.row.nickName }}
            </template>
          </el-table-column>
          <el-table-column prop="orderSn" label="客户微信头像" width="120" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.userWechatImage" style="width:50px;height:50px;" alt="">
            </template>
          </el-table-column>

          <el-table-column :sortable="'custom'" prop="orderMount" label="商品数量" min-width="100" align="center">
            <template slot-scope="scope">
              {{ scope.row.totalGoods }}
            </template>
          </el-table-column>
          <el-table-column :sortable="'custom'" prop="orderMount" label="商品种类" min-width="100" align="center">
            <template slot-scope="scope">
              {{ scope.row.totalKinds }}
            </template>
          </el-table-column>
          <el-table-column :sortable="'custom'" prop="orderMount" label="订单金额" min-width="100" align="center">
            <template slot-scope="scope">
              {{ formatPrice(scope.row.orderMount) }}
            </template>
          </el-table-column>
          <el-table-column :sortable="'custom'" prop="orderMount" label="订单金额" min-width="100" align="center">
            <template slot-scope="scope">
              {{ formatPrice(scope.row.orderMount) }}
            </template>
          </el-table-column>
          <el-table-column prop="orderSn" label="订单号" width="120" align="center">
            <template slot-scope="scope">
              {{ scope.row.orderSn }}
            </template>
          </el-table-column>
          <el-table-column prop="payStatus" label="订单状态" align="center">
            <template slot-scope="scope">
              {{ orderStatusMaps[scope.row.payStatus] }}
            </template>
          </el-table-column>
          <el-table-column prop="postScript" label="订单留言" align="center">
            <template slot-scope="scope">
              {{ scope.row.postScript }}
            </template>
          </el-table-column>
          <el-table-column :sortable="'custom'" prop="payTime" label="支付时间" min-width="100" align="center">
            <template slot-scope="scope">
              {{ scope.row.payTime | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="tradeNo" label="交易号" width="120" align="center">
            <template slot-scope="scope">
              {{ scope.row.tradeNo }}
            </template>
          </el-table-column>
          <el-table-column :sortable="'custom'" prop="createAt" label="创建时间" min-width="100" align="center">
            <template slot-scope="scope">
              {{ scope.row.createAt | formatDate }}
            </template>
          </el-table-column>
          <el-table-column :sortable="'custom'" prop="updateAt" label="更新时间" min-width="100" align="center">
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="65%" top="7vh">
      <el-form ref="orderInfoForm" :model="orderInfoTemp" :rules="rules" class="form-add" label-width="100px" style="width: 100%; padding-left:10px;padding-right:10px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="订单号" prop="orderSn">
              <el-input v-model="orderInfoTemp.orderSn" disabled style="width:100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交易号" prop="tradeNo">
              <el-input v-model="orderInfoTemp.tradeNo" disabled style="width:100%"/>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="订单状态" prop="payStatus">
              <el-select v-model="orderInfoTemp.payStatus">
                <el-option v-for="(value, key) in orderStatusMaps" :key="key" :value="key" :label="value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单金额" prop="orderMount">
              <span>{{ formatPrice(orderInfoTemp.orderMount) }}元</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付时间" prop="payTime">
              <el-date-picker
                v-model="orderInfoTemp.payTime"
                type="date"
                placeholder="选择日期"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="提货方式" prop="shipMethod">
              <el-select v-model="orderInfoTemp.shipMethod">
                <el-option v-for="(value,key) in shipMethodMaps" :value="key" :label="value" :key="key"/>
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="8">
            <el-form-item v-show="orderInfoTemp.shipMethod === '0' " label="快递公司">
              <el-select v-model="orderInfoTemp.logisticsType">
                <el-option v-for="(value,key) in logisticsTypeMaps" :value="key" :label="value" :key="key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="快递号" prop="tradeNo">
              <el-input v-model="orderInfoTemp.logisticsNo" style="width:100%"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="签收人" prop="signerName">
              <el-input v-model="orderInfoTemp.signerName" style="width:100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="signerMobile">
              <el-input v-model="orderInfoTemp.signerMobile" style="width:100%"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="收货地址" prop="address">
          <el-input v-model="orderInfoTemp.address" style="width:100%"/>
        </el-form-item>
        <el-form-item label="订单留言">
          <el-input v-model="orderInfoTemp.postScript" type="textarea" style="width:100%"/>
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
        <el-form-item label="订单号">
          <span> {{ showData.orderSn }}</span>
        </el-form-item >
        <el-form-item label="交易号">
          <span> {{ showData.tradeNo }}</span>
        </el-form-item >
        <el-form-item label="订单状态">
          <span> {{ orderStatusMaps[showData.payStatus] }}</span>
        </el-form-item >
        <el-form-item label="订单留言">
          <span> {{ showData.postScript }}</span>
        </el-form-item >
        <el-form-item label="订单金额">
          <span> {{ formatPrice(showData.orderMount) }}</span>
        </el-form-item >
        <el-form-item label="支付时间">
          <span> {{ showData.payTime }}</span>
        </el-form-item >
        <el-form-item label="提货方式">
          <span> {{ showData.shipMethod }}</span>
        </el-form-item >
        <el-form-item label="收货地址">
          <span> {{ showData.address }}</span>
        </el-form-item >
        <el-form-item label="签收人">
          <span> {{ showData.signerName }}</span>
        </el-form-item >
        <el-form-item label="联系电话">
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
import { listOrderInfo, createOrderInfo, updateOrderInfo, deleteOrderInfo } from '@/api/OrderInfoApi'
import waves from '@/directive/waves'
import { formatDate } from '@/utils'

export default {
  name: 'OrderInfo',
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
        update: '编辑订单记录',
        create: '添加订单记录'
      },
      showData: '',
      listParams: {
        page: 1,
        size: 10,
        'payStatus.equals': undefined,
        'signerName.equals': undefined,
        'orderSn.contains': undefined,
        'tradeNo.contains': undefined,
        'userId.equals': this.userId
      },
      data: [],
      orderStatusMaps: {
        'WAITTINGSEND': '待发货',
        'WAITTINGPAY': '待付款',
        'WAITTINGRECIVE': '待收货',
        'FINISH': '已完成'
      },
      shipMethodMaps: {
        0: '邮寄',
        1: '自提'
      },
      logisticsTypeMaps: {
        'YUNDA': '韵达',
        'SFEXPRESS': '顺丰',
        'EMS': 'EMS'
      },
      orderInfoTemp: {
        orderSn: undefined,
        tradeNo: undefined,
        payStatus: undefined,
        postScript: undefined,
        orderMount: undefined,
        payTime: undefined,
        shipMethod: undefined,
        address: undefined,
        signerName: undefined,
        signerMobile: undefined,
        logisticsType: undefined,
        logisticsNo: undefined,
        id: undefined
      },
      rules: {
        orderSn: [{ required: true, message: '订单号为必须参数', trigger: 'change' }],
        tradeNo: [{ required: true, message: '交易号为必须参数', trigger: 'change' }],
        payStatus: [{ required: true, message: '订单状态为必须参数', trigger: 'change' }],
        postScript: [{ required: true, message: '订单留言为必须参数', trigger: 'change' }],
        orderMount: [{ required: true, message: '订单金额为必须参数', trigger: 'change' }],
        payTime: [{ required: true, message: '支付时间为必须参数', trigger: 'change' }],
        shipMethod: [{ required: true, message: '提货方式为必须参数', trigger: 'change' }],
        address: [{ required: true, message: '收货地址为必须参数', trigger: 'change' }],
        signerName: [{ required: true, message: '签收人为必须参数', trigger: 'change' }],
        signerMobile: [{ required: true, message: '联系电话为必须参数', trigger: 'change' }]
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
        'orderSn.contains': this.listParams['orderSn.contains'] === '' ? undefined : this.listParams['orderSn.contains'],
        'tradeNo.contains': this.listParams['tradeNo.contains'] === '' ? undefined : this.listParams['tradeNo.contains'],
        'payStatus.equals': this.listParams['payStatus.equals'] === '' ? undefined : this.listParams['payStatus.equals'],
        'signerName.equals': this.listParams['signerName.equals'] === '' ? undefined : this.listParams['signerName.equals'],
        'sort': this.listParams['sort'] === '' ? null : this.listParams['sort']
      }
      this.loading = true
      listOrderInfo(params).then(response => {
        this.loading = false
        this.data = response.data.data.map(item => {
          let total = 0
          item.orderGoods.forEach(goods => {
            total = total + goods.goodsNum
          })
          item['totalGoods'] = total
          item['totalKinds'] = item.orderGoods.length
          return item
        })
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
    resetorderInfoTemp() {
      this.orderInfoTemp = {
        orderSn: undefined,
        tradeNo: undefined,
        payStatus: undefined,
        postScript: undefined,
        orderMount: undefined,
        payTime: undefined,
        shipMethod: undefined,
        address: undefined,
        signerName: undefined,
        signerMobile: undefined,
        logisticsType: undefined,
        logisticsNo: undefined,
        id: undefined
      }
    },
    formatPrice(num) {
      return Number(num / 100).toFixed(2)
    },
    handleCreate() {
      this.resetorderInfoTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['orderInfoForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['orderInfoForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          createOrderInfo(this.orderInfoTemp).then(response => {
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
      Object.assign(this.orderInfoTemp, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['orderInfoForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['orderInfoForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          updateOrderInfo(this.orderInfoTemp.id, this.orderInfoTemp).then(response => {
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
      this.$confirm('确认删除该订单记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrderInfo(id).then(response => {
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
          '订单号',
          '交易号',
          '订单状态',
          '订单留言',
          '订单金额',
          '支付时间',
          '提货方式',
          '收货地址',
          '签收人',
          '联系电话',
          '创建时间',
          '更新时间']
        const filterVal = ['id',
          'orderSn',
          'tradeNo',
          'payStatus',
          'postScript',
          'orderMount',
          'payTime',
          'shipMethod',
          'address',
          'signerName',
          'signerMobile',
          'createAt',
          'updateAt']
        const params = Object.assign({}, this.listParams)
        params.size = this.total
        listOrderInfo(params).then(response => {
          this.exportList = response.data.data
          const data = this.formatJson(filterVal, this.exportList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '订单记录数据表格'
          })
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createAt' || j === 'updateAt') {
          return formatDate(v[j])
        } else if (j === 'payTime') {
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
.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
