<template>
  <div class="app-container">
    <!-- 查询参数过滤 -->
    <div class="filter-container" style="margin-bottom: 30px">
     
    </div>
    <el-row>
      <div class='chart-container'>
        <el-table ref="UserChatTable" :data="data" @sort-change="sortSignTime" v-loading="loading" @row-dblclick="openDetails" border fit highlight-current-row style="width: 100%;">
          <!-- 操作 -->
          <!-- <el-table-column align="center" :label="$t('table.actions')" width="80px" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="text" title="编辑"  @click="handleUpdate(scope.row)"><i class="el-icon-edit"></i></el-button>
              <el-button type="text" title="删除"  @click="deleteData(scope.row.id)"><i class="el-icon-delete"></i></el-button>
            </template>
          </el-table-column> -->
          <el-table-column type="index" align="center" width="50"></el-table-column>
          <el-table-column prop="message" label="昵称" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              {{ scope.row.nickName }}
            </template>
          </el-table-column>
          <el-table-column prop="sendType" label="头像" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              <img :src="scope.row.imageUrl" alt="" style="height:50px;width:50px">
            </template>
          </el-table-column>
          <el-table-column prop="messageType" label="最新回复" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              {{ scope.row.latestSend === 'self' ? '客户' : '客服' }}
            </template>
          </el-table-column>
           <el-table-column prop="messageType" label="最新消息" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              {{ scope.row.latestMessage }}
            </template>
          </el-table-column>
           <el-table-column prop="messageType" label="最新时间" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              {{ scope.row.latestDate | formatDate }}
            </template>
          </el-table-column>
           <el-table-column prop="messageType" label="总消息数" align="center" :sortable="'custom'">
            <template slot-scope="scope">
              {{ scope.row.total }}
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
      <el-form class="form-add" :model="userChatTemp" :rules="rules" ref="userChatForm" label-width="100px" style="width: 100%; padding-left:10px;padding-right:10px">
        <el-form-item label="" prop="message">
          <el-input v-model="userChatTemp.message" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="" prop="sendType">
          <el-input v-model="userChatTemp.sendType" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="" prop="messageType">
          <el-input v-model="userChatTemp.messageType" style="width:100%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :loading="buttonLoading">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" :loading="buttonLoading" @click="updateData">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogDetailVisible" title="交流" width="40%" top="7vh" style="width: 100%;">
      	<ul class="chat-thread" v-for="item in messageList" :key="item.id">
          <li v-if="item.sendType === 'self'" class="self">{{item.message}}</li>
          <li v-else class="other">{{item.message}}</li>
        </ul>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-input type="textarea" width="height: 150px;" v-model="sendMessageForm.message"/>
          </el-col>
          <el-col :span="4">
            <el-button size="large" @click="sendToMessage(showData.userId)">发送</el-button>
          </el-col>
        </el-row>
        
        
    </el-dialog>
  </div>
</template>

<script>
import { listUserChat, listUserChatGroup, createUserChat, updateUserChat, deleteUserChat } from '@/api/UserChatApi'
import waves from '@/directive/waves'
import { formatDate } from '@/utils'

export default {
  name: 'UserChat',
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
      messageList: '',
      textMap: {
        update: '编辑客户交流',
        create: '添加客户交流'
      },
      showData: '',
      listParams: {
        page: 1,
        size: 10,
        'name.contains': undefined
      },
      data: [],
      sendMessageForm: {
        messageType: 'text',
        message: undefined,
        sendType: 'other',
        userId: undefined,
      },
      userChatTemp: {
        message: undefined,
        sendType: undefined,
        messageType: undefined,
        id: undefined
      },
      rules: {
        message: [{ required: true, message: '为必须参数', trigger: 'change' }],
        sendType: [{ required: true, message: '为必须参数', trigger: 'change' }],
        messageType: [{ required: true, message: '为必须参数', trigger: 'change' }],
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
      listUserChatGroup(params).then(response => {
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
      listUserChat({size: 9999, 'userId.equals': row.userId}).then(resp => {
        this.messageList = resp.data.data
      })
      this.dialogDetailVisible = true
    },
    sendToMessage(userId) {
      this.sendMessageForm.userId = userId
      createUserChat(this.sendMessageForm).then(resp => {
        listUserChat({size: 9999, 'userId.equals': userId}).then(resp => {
          this.messageList = resp.data.data
        })
      })
    },
    resetuserChatTemp() {
      this.userChatTemp = {
        message: undefined,
        sendType: undefined,
        messageType: undefined,
        id: undefined
      }
    },
    handleCreate() {
      this.resetuserChatTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['userChatForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['userChatForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          createUserChat(this.userChatTemp).then(response => {
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
      Object.assign(this.userChatTemp, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['userChatForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['userChatForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          updateUserChat(this.userChatTemp.id, this.userChatTemp).then(response => {
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
      this.$confirm('确认删除该客户交流, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserChat(id).then(response => {
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
          '',
          '',
          '',
          '创建时间',
          '更新时间']
        const filterVal = ['id',
          'message',
          'sendType',
          'messageType',
          'createAt',
          'updateAt']
        const params = Object.assign({}, this.listParams)
        params.size = this.total
        listUserChat(params).then(response => {
          this.exportList = response.data.data
          const data = this.formatJson(filterVal, this.exportList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '客户交流数据表格'
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
@import 'http://fonts.googleapis.com/css?family=Noto+Sans';
/* body {
  padding: 0;
  margin: 0;
  background: -moz-linear-gradient(-45deg, #183850 0, #183850 25%, #192c46 50%, #22254c 75%, #22254c 100%);
  background: -webkit-linear-gradient(-45deg, #183850 0, #183850 25%, #192c46 50%, #22254c 75%, #22254c 100%);
  background-repeat: no-repeat;
  background-attachment: fixed;
} */

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: rgba(25, 147, 147, 0.1);
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(25, 147, 147, 0.2);
}

.chat-thread {
  margin: 24px auto 0 auto;
  padding: 0 20px 0 0;
  list-style: none;
  overflow-y: scroll;
  overflow-x: hidden;
}

.chat-thread li {
  position: relative;
  clear: both;
  display: inline-block;
  padding: 16px 40px 16px 20px;
  margin: 0 0 20px 0;
  font: 16px/20px 'Noto Sans', sans-serif;
  border-radius: 10px;
  background-color: rgba(25, 147, 147, 0.2);
}

/* Chat - Avatar */
.chat-thread li:before {
  position: absolute;
  top: 0;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  content: '';
}

/* Chat - Speech Bubble Arrow */
.chat-thread li:after {
  position: absolute;
  top: 15px;
  content: '';
  width: 0;
  height: 0;
  border-top: 15px solid rgba(25, 147, 147, 0.2);
}

.chat-thread .other {
  animation: show-chat-odd 0.15s 1 ease-in;
  -moz-animation: show-chat-odd 0.15s 1 ease-in;
  -webkit-animation: show-chat-odd 0.15s 1 ease-in;
  float: right;
  margin-right: 80px;
  color: #0AD5C1;
}

.chat-thread .other:before {
  right: -90px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAyCAYAAADFhCKTAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAhzSURBVGhD7Vl7bFtXHf78iOMkTpqkTWjX9cGK2nX7qwkVEo/CHlRMgKahaVoRm6ZVk1AZaieE+IOB4A+GADEEhSEk6IS6Mbpl01g6hYx0dGubrs3SdVuXZi1pHnVTO7HTxK/4ffl+19eO7ftw4mygSfsk695zfO653/md7/c4tk0h8BGBXbt+JPAx2Q8LH4hmp+IZ/PBMFINTSfhiWbTU2PDpthr8qNODTzU6tVHLx7LJPtA/h78ORLhHNmxZ68KNDQ6MxzI4eykGzGfwlW0e9Hy1TRu9TAjZarH1pYCCP1xRHj4V0npK8ejAnIJfjinNT3q1nuWharJ7B8IK/jipHBqNaT3GOOKNK/jVqHLLP/xaT/WoimwkmVGJPnza2KLl+NkgLfzYiHLcF9d6qkNV0WD/hXlVo/u3N2o91vjBNo5rcuJ3Z0NaT3VYMtkEjfrni/PouN6l9VSGw2bDnTfU4dnhKIKMHNViSWT3vRmG+2k/vHGgs7VG610cNrXkxq/69SV8/WW/er9ULIrs8Fwam7tncGAkjnXcTjefitPCS0E6y/E23qyqxeELEdh+ewmvX6WcloCKZPt8Sdxy5BpDpoKVtbnhNby8EUiq94vFORnv0BqyWmr+i0958eTQ4nVsSfZUMIV7T4TQQHZuhw2KahrAxRddnMkwc2XVdiUEqNNXvQnAmXueE4mQSdqBB7t9OLhIwqZk55JZ3HF0Fm11dtWS5fCw/+7X5rSWNb59bBYQv9K4FsBFo96B+1+cxJlpOkIFmJK99d+zWFNv53y5N2QZk8WOIlW5dzPlH5tM4v7j1lbZd3IWz7/HdOziPDKBaDd/FQtrhDv/MirDLWFI9udDMQQpMbGoUI2msoilSVYI8wU537KhmYs5+J95rO+axmFuM78u4ORUAlu7prD/7QjaWpz4hMuOtdz266jXjR4nruPOIKWFMdGyw44vPzeRa5tAV8gEuf3be6+hxeXgzmUQTdpwY5Md3TuaaRBmPG1cHrIYCZ1JrqI5vzoixHmctFp9XqcG2NXjw9+Hw9QyGzJxMIGhvZuxtdU4huss+5v3Y7SoDdruqzu2SqIA2yIJCfDFH+kTQs20XJ6ooIltK6IqRAKF1fOmsQZ7en1aW48SstFMFq/4UvAUvYQGxulgGvG0tedHKZPvvRXB7v4Qbn/JB9YP2jfm+Ncoy0jZjTxh3h8dnsM8ZWeEErKDDEfTiSzls0BWrDcezWA0ak22gVspoe7AuSiOXIzBI6u0wLmZJIKsdwtbmAcJP3ZqRmuUooTsU+MJbifjaZkwhcgzY5VCiw17NtUxVSn4yedbtD5znLrC7MWxxdJRQcm9OkIdG6DEwXYybs5yC5SsJACZK4NU1o44vXY1Y9WJnc25gR8APtc1iX6vJoOMSIZvVMg8zXsuIvzIZt3uFCzrp0uHOajE1BrEq0cpBS+PK1aY4PdS6DxxniQqoF8sK1msHEIglkKEcixHgVswoaix1OBx1WklFA3OpLUeYwzNppGYy+DIZesC5aSfqVemshmZhi/jCy9c09cehdERRvoUFVGu9zw83K5DFXT7LsmizoGj/pTWY4xjshiT96jgd1eiesMUyEpksjo41NHJTgSsLXtFvJtbOzNnTfYAi3BYlcMkG0+VeTlRYOeUO5t5eHJwBnG+gYA5kYmIhD3eJBVMhM0X9r7o1W5uGPG1uhq96QtPNHGba6mV8rCVh8hD4Vr6/OZ1rI9OoS6a2etlE92+4hWinMxMbwJy2MAivxwFsu2Mbw3MXCZcVYhunxs31u08ndPP+lat0jjP29PGi+q5RLJSgZlBrMU6Y1Ozvj4okG3lBE18iVRVZpCiezicMTzSyEliljpTJ6QWhqaMyXaNUq9GISsPTu1aUYPGWgvLCrbS9IlstpKjoneSoacMAYY2KQfUZ7mokwH9GIFXIoVVJuaiv7Cmng6tZ1FC9pvrXVAd2YStdEvC6bqsJzJG58qIWWQQP2kmkQgXUIxnRpgs9AYrBXX/tS3Gv0eUkO1gkbyhwc6MZ6wF6W2gB70wod/i85SHnNNUyIVzDPhLnezwCCUgpaTx9Ll+7uy+jtZcuwwlZMU57rm+FrNSYJhA+MQYmsYjpal3jJZ05T1cHucW/HOi1Bn75NBoqlf2J9O4r3Ol1tajhKzgIVZOPHVYOpqbMbBrolQKQSkthUf+OWru3cAC2QATxtQ1akzClhEkCrC2+NMdq7UOPXRkxeMfvakePoufeeQE8EKZbqfyZPNgY2R6YcwhCVm6t2mQ5+az+M6OdmZrs0Emj9+z3o1O6pfFjzpPOSR59F9d0G2C2xAg2ZI4z/sLgSQLoNyie8akHDSajaDsGpnPf39ru9ZhDNNldO9YoZKQH+LKoe4kmfXyKC4Q8ns312EyxlpY5cNnImkMPriRZzEHdzeL12Vx5eFImlKUMD5f3nNDrs8C5jYnBne2qqdWyU7FkJabCebFIge6b2MdHu/wICqOF0qjd9dadLS71e9GWTaGGS10b1OJZnFu9yexQmJiBViOWMUz/vHbm5lmWcQwZhaSMS8StHuKpCD47pZ67L65Hr+4rRU71/GIo+GQ/L9Q/CaxqNQRvL71wAbcvHJxP58u6g+QNIfc9VoIfSTX4uYxnceeNA/pUyEeMHe1cVHWh8PO5/04IwWQk5aUPEGJ3LTahb5vrMGa+kpZYgGVbU84qc/uL63Awc82IUSL+PlRT+b03L+N6bNZMQIsbs7PSMhiQ37IY+n4+G0r8d631i2JqGBRZPO4e0MtIve244ntHrjFy2JpPH3RuBTM4zQtOn81wYSh4MefaYHy/U14ZFuVB0+RQbXw0/N+ejashJMZrUcP1q/KO8Gk1loelv2n3f8SS5LB/xsfk/1wAPwXzEDLAYlY2PgAAAAASUVORK5CYII=);
}

.chat-thread .other:after {
  border-right: 15px solid transparent;
  right: -15px;
}

.chat-thread .self {
  animation: show-chat-even 0.15s 1 ease-in;
  -moz-animation: show-chat-even 0.15s 1 ease-in;
  -webkit-animation: show-chat-even 0.15s 1 ease-in;
  float: left;
  margin-left: 80px;
  color: #0EC879;
}

.chat-thread .self:before {
  left: -80px;
  background-image: url(data:image/png;base64,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);
}

.chat-thread .self:after {
  border-left: 15px solid transparent;
  left: -15px;
}

.chat-window {
  position: fixed;
  bottom: 18px;
}

.chat-window-message {
  width: 100%;
  height: 48px;
  font: 32px/48px 'Noto Sans', sans-serif;
  background: none;
  color: #0AD5C1;
  border: 0;
  border-bottom: 1px solid rgba(25, 147, 147, 0.2);
  outline: none;
}

/* Small screens */
@media all and (max-width: 767px) {
  .chat-thread {
    width: 90%;
		height: 90%;
  }

  .chat-window {
    left: 5%;
    width: 90%;
  }
}
/* Medium and large screens */
@media all and (min-width: 768px) {
  .chat-thread {
    width: 100%;
    height: 90%;
  }

  .chat-window {
    left: 25%;
    width: 50%;
  }
}
@keyframes show-chat-even {
  0% {
    margin-left: -480px;
  }

  100% {
    margin-left: 0;
  }
}
@-moz-keyframes show-chat-even {
  0% {
    margin-left: -480px;
  }

  100% {
    margin-left: 0;
  }
}
@-webkit-keyframes show-chat-even {
  0% {
    margin-left: -480px;
  }

  100% {
    margin-left: 0;
  }
}
@keyframes show-chat-odd {
  0% {
    margin-right: -480px;
  }

  100% {
    margin-right: 0;
  }
}
@-moz-keyframes show-chat-odd {
  0% {
    margin-right: -480px;
  }

  100% {
    margin-right: 0;
  }
}
@-webkit-keyframes show-chat-odd {
  0% {
    margin-right: -480px;
  }

  100% {
    margin-right: 0;
  }
}
.credits{
  text-align:center;
  margin-top:35px;
  color: rgba(255, 255, 255, 0.35);
  font-family: 'Noto Sans', sans-serif;
}
.credits a{
  text-decoration:none;
  color: rgba(255, 255, 255, 0.35);
}
</style>
