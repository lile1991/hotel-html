<template>
  <div class="check-record-container">
    <el-form :inline="true" :model="condition" class="demo-form-inline">
      <el-form-item label="审批人">
        <el-input v-model="condition.user" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="condition.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
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
      <el-table-column label="状态" width="100" align="center"
                       :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"
                       :filter-method="filterTag"
                       filter-placement="bottom-end">
        <template slot-scope="scope">
          {{scope.row.state}}
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.customer}}
        </template>
      </el-table-column>
      <el-table-column label="入住时间" width="210" align="center">
        <template slot-scope="scope">
          {{scope.row.checkInTime}}
        </template>
      </el-table-column>
      <el-table-column label="离店时间" width="210" align="center">
        <template slot-scope="scope">
          {{scope.row.checkOutTime}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="210" align="center">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.createUser.name}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-search" v-if="scope.row.state === 'RESERVE'" v-on:click="reserveCheckIn(scope.row)">预约入住</el-button>
          <el-button type="primary" size="mini" icon="el-icon-search" v-if="scope.row.state === 'CHECK_IN'" v-on:click="leave(scope.row)">退房</el-button>
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
        checkRecordsLoading: false
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
    },
    methods: {
      reserveCheckIn(checkRecord) {
        CheckRecordApi.reserveCheckIn(checkRecord.id).then(response => {
          this.$message({
            type: 'success',
            message: response.msg
          });
        });
      },
      leave(checkRecord) {
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
      filterTag(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        };
        return statusMap[status]
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
