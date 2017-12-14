<template>
  <div class="check-record-container">
    <el-table :data="checkRecords" v-loading.body="checkRecordsLoading" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column label="房间" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.room.id}}</span>
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
          {{scope.row.createUser.id}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { CheckRecordApi } from '@/api/checkRecord'

  export default {
    data() {
      return {
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
      filterTag(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        };
        return statusMap[status]
      }
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
