<template>
  <div class="check-record-container">
    <el-form :inline="true" :model="condition" class="demo-form-inline">
      <el-form-item label="登记手机号">
        <el-input v-model="condition.user" placeholder="任意入住人手机号"></el-input>
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="condition.user" placeholder="登记人姓名"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="condition.region" placeholder="入住状态">
          <el-option :label="checkStateEnum.desc" :value="checkStateEnum.name" v-for="checkStateEnum in checkStateEnums"></el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item label="入住时间">
        <el-date-picker
          v-model="value4"
          type="datetimerange"
          :picker-options="pickerOptions"
          align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="登记时间">
        <el-date-picker
          v-model="value4"
          type="datetimerange"
          :picker-options="pickerOptions"
          align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="checkRecords" v-loading.body="checkRecordsLoading" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column label="房间" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.room.alias}}</span>
        </template>
      </el-table-column>
      <!--:filters="[
        { text: '已预定', value: 'RESERVE' },
        { text: '已取消预定', value: 'CANCELED_RESERVE' },
        { text: '已入住', value: 'CHECK_IN' },
        { text: '已退房', value: 'LEFT' }
      ]"
      :filter-method="filterRecordState"
      filter-placement="bottom-end"-->
      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.stateDesc}}
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.customer}}
        </template>
      </el-table-column>
      <el-table-column label="入住时间" width="210" align="center">
        <template slot-scope="scope">
          {{scope.row.checkInTime | dateFormat("YYYY-MM-DD HH:mm")}}
        </template>
      </el-table-column>
      <el-table-column label="离店时间" width="210" align="center">
        <template slot-scope="scope">
          {{scope.row.checkOutTime | dateFormat("YYYY-MM-DD HH:mm")}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="210" align="center">
        <template slot-scope="scope">
          {{scope.row.createTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.createUser.name}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-search" v-if="scope.row.state === 'RESERVE'" v-on:click="reserveCheckIn(scope.row)">预约入住(交押金等等)</el-button>
          <el-button type="primary" size="mini" icon="el-icon-search" v-if="scope.row.state === 'CHECK_IN'" v-on:click="checkOut(scope.row)">退房(扣除押金等等)</el-button>
          <el-button type="primary" size="mini" icon="el-icon-search" v-if="scope.row.state === 'CHECK_IN'" v-on:click="replace(scope.row)">换房</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import CheckRecordApi from '@/api/checkRecord'

  export default {
    data() {
      return {
        condition: {},
        checkRecords: [],
        checkStateEnums: [],
        checkRecordsLoading: false,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        };
        return statusMap[status]
      }
    },
    created() {
      this.fetchCheckRecord();
      this.getCheckStateEnums();
    },
    methods: {
      getCheckStateEnums() {
        CheckRecordApi.getCheckStateEnums().then(response => {
          this.checkStateEnums = response.data;
        })
      },
      reserveCheckIn(checkRecord) {
        CheckRecordApi.reserveCheckIn(checkRecord.id).then(response => {
          this.$message({
            type: 'success',
            message: response.msg
          });
        });
      },
      checkOut(checkRecord) {
        this.$router.push({ path: '/room/checkOut', room: room})
        CheckRecordApi.leave(checkRecord.id).then(response => {
          this.$message({
            type: 'success',
            message: response.msg
          });
        });
      },
      replace(checkRecord) {
        alert("功能开发中");
      },
      filterRecordState(state) {
        /*const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        };*/
        // return statusMap[state]
      },
      fetchCheckRecord() {
        this.checkRecordsLoading = true;
        CheckRecordApi.findManage({}).then(response => {
          this.checkRecords = response.data.content;
          this.checkRecordsLoading = false;
        })
      }
    }
  }
</script>
