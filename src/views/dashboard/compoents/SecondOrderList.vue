<template>
	<el-row>
      <div class="chart-container">
        <el-table ref="OrderInfoTable" :data="data" fit highlight-current-row style="width: 100%;">
          <el-table-column type="index" align="center" width="50"/>
          <!-- <el-table-column type="expand">
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
          </el-table-column> -->
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

         <!-- <el-table-column :sortable="'custom'" prop="orderMount" label="商品数量" min-width="100" align="center">
            <template slot-scope="scope">
              {{ scope.row.totalGoods }}
            </template>
          </el-table-column>
          <el-table-column :sortable="'custom'" prop="orderMount" label="商品种类" min-width="100" align="center">
            <template slot-scope="scope">
              {{ scope.row.totalKinds }}
            </template>
          </el-table-column> -->
          <el-table-column :sortable="'custom'" prop="orderMount" label="订单金额" min-width="100" align="center">
            <template slot-scope="scope">
              {{ scope.row.orderMount/ 100 }}
            </template>
          </el-table-column>
          <el-table-column :sortable="'custom'" prop="orderMount" label="订单金额" min-width="100" align="center">
            <template slot-scope="scope">
              {{ scope.row.orderMount/100 }}
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
          
        </el-table>
      </div>
    </el-row>
</template>

<script>
import { listOrderInfo } from '@/api/OrderInfoApi'
import { formatDate } from '@/utils'
import { orderStatusMaps } from '@/contants'
export default {
	name: 'SecondGoodsList',
	data() {
		return {
			orderStatusMaps:{
		'WAITTINGSEND': '待发货',
		'WAITTINGPAY': '待付款',
		'WAITTINGRECIVE': '待收货',
		'FINISH': '已完成'
	},
			data: []
		}
	},
	created() {
		console.log(orderStatusMaps)
		this.initGoodsList()
	},
	methods: {
		formatDate,
		initGoodsList() {
			listOrderInfo({ size: 5, sort: 'updateAt,desc'}).then(resp => {
				this.data = resp.data.data
			})
		}
	},
}

</script>

<style>
</style>
