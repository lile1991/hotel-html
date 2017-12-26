<template>
  <div class="check-record-container">
    <el-form :inline="true" :model="condition" class="demo-form-inline">
      <el-form-item label="登记手机号">
        <el-input v-model="condition.user" placeholder="任意入住人手机号"></el-input>
      </el-form-item>
      <el-form-item label="入住人">
        <el-input v-model="condition.checkInCustomerName" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="condition.user" placeholder="创建人姓名"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="condition.state" placeholder="入住状态">
          <el-option :label="checkStateEnum.desc" :value="checkStateEnum.name"
                     v-for="checkStateEnum in checkStateEnums"></el-option>
        </el-select>
      </el-form-item>
      <br/>
      <el-form-item label="入住时间">
        <el-date-picker
          v-model="condition.checkInTimeBegin"
          type="datetime"
          placeholder="起始">
        </el-date-picker>
        -
        <el-date-picker
          v-model="condition.checkInTimeEnd"
          type="datetime"
          placeholder="结束">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="登记时间">
        <el-date-picker
          v-model="condition.createTimeBegin"
          type="datetime"
          placeholder="起始">
        </el-date-picker>
        -
        <el-date-picker
          v-model="condition.createTimeEnd"
          type="datetime"
          placeholder="结束">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchCheckInRecord">查询</el-button>
      </el-form-item>
    </el-form>


    <el-table :data="pageData.content" v-loading.body="checkInRecordsLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
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
      <el-table-column label="更新人" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.updateUser.name}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-goods" v-if="scope.row.state === 'RESERVE'"
                     v-on:click="reserveCheckIn(scope.row)">预约入住
          </el-button>
          <el-button type="danger" size="mini" icon="el-icon-sold-out" v-if="scope.row.state === 'CHECK_IN'"
                     v-on:click="checkOut(scope.row)">退房
          </el-button>
          <!--<el-button type="primary" size="mini" icon="el-icon-search" v-if="scope.row.state === 'CHECK_IN'"
                     v-on:click="replace(scope.row)">换房
          </el-button>-->
          <el-button type="primary" size="mini" icon="el-icon-info" v-on:click="detail(scope.row)">详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="condition.page"
      :page-sizes="[20, 50, 80, 100]"
      :page-size="condition.size"
      layout="sizes, prev, pager, next, jumper, total"
      :total="pageData.totalElements">
    </el-pagination>
  </div>
</template>

<script>
  import CheckInRecordApi from '@/api/checkInRecord'

  export default {
    data() {
      return {
        condition: {
          page: 1,
          size: 20,
          checkInTimeBegin: null,
          checkInTimeEnd: null,
          createTimeBegin: null,
          createTimeEnd: null,
          checkInCustomerName: null,
          state: null
        },
        pageData: {
          totalElements: 0
        },
        checkStateEnums: [],
        checkInRecordsLoading: false,
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
      this.fetchCheckInRecord();
      this.getCheckStateEnums();
    },
    methods: {
      getCheckStateEnums() {
        CheckInRecordApi.getCheckStateEnums().then(response => {
          this.checkStateEnums = response.data;
        })
      },
      reserveCheckIn(checkRecord) {
        CheckInRecordApi.reserveCheckIn(checkRecord.id).then(response => {
          this.$message({
            type: 'success',
            message: response.msg
          });
        });
      },
      checkOut(checkRecord) {
        this.$router.push({path: '/checkRecord/checkOut/' + checkRecord.id});
        /*CheckInRecordApi.leave(checkRecord.id).then(response => {
          this.$message({
            type: 'success',
            message: response.msg
          });
        });*/
      },
      replace(checkRecord) {
        alert("功能开发中");
      },
      detail(checkRecord) {
        this.$router.push({path: '/checkRecord/detail/' + checkRecord.id});
      },
      filterRecordState(state) {
        /*const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        };*/
        // return statusMap[state]
      },
      fetchCheckInRecord() {
        this.checkInRecordsLoading = true;
        CheckInRecordApi.findManage(this.condition).then(response => {
          this.pageData = response.data;
          this.checkInRecordsLoading = false;
        })
      },
      handleSizeChange(size) {
        this.condition.size = size;
        this.fetchCheckInRecord();
      },
      handleCurrentChange(page) {
        this.condition.page = page;
        this.fetchCheckInRecord();
      }
    }
  }
</script>
