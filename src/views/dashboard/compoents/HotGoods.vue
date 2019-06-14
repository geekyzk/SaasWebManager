<template>
	<el-row>
		<el-table :data="data" fit highlight-current-row style="width: 100%;">
			<el-table-column type="index" align="center" width="50"/>
		<el-table-column label="图片" align="center">
			  <template slot-scope="scope">
			    <img v-if="scope.row.showImage !== undefined && scope.row.showImage !== ''" :src="scope.row.showImage" alt="" style="width:50px;height:50px">
				<span v-else></span>
			  </template>
			</el-table-column>
			 <el-table-column label="名称" align="center">
			  <template slot-scope="scope">
			    {{ scope.row.name }}
			  </template>
			</el-table-column>
		
			 <el-table-column label="销量" align="center">
			  <template slot-scope="scope">
			    {{ scope.row.soldNum }}
			  </template>
			</el-table-column>
		</el-table>
	</el-row>
</template>

<script>
	import {queryHotGoods} from '@/api/DashboardApi'
	export default {
		name: 'HotGoods',
		data() {
			return {
				data: [],
				columnNum: []
			}
		},
		created() {
			this.initHotGoodsList()
		},
		methods: {
			initHotGoodsList() {
				queryHotGoods().then(resp => {
					this.data = resp.data.data
					
				})
			}
		},
	}
</script>

<style>
</style>
