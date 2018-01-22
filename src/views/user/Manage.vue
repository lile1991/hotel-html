<template>
  <div class="check-record-container">
    <el-form :inline="true" :model="condition" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="condition.name" placeholder="管理员姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="condition.mobile" placeholder="管理员手机号码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchCheckInRecord">查询</el-button>
      </el-form-item>
    </el-form>


    <el-table :data="pageData.content" v-loading.body="usersLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <el-table-column label="姓名" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="200" align="center">
        <template slot-scope="scope">
          {{scope.row.mobile}}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.locked" type="danger">禁用</el-tag>
          <el-tag v-else type="success">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="210" align="center">
        <template slot-scope="scope">
          {{scope.row.createTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="mini" icon="el-icon-circle-check" v-if="scope.row.locked === '1'"
                     v-on:click="unlock(scope.row)">启用
          </el-button>
          <el-button type="danger" size="mini" icon="el-icon-remove" v-else
                     v-on:click="lock(scope.row)">禁用
          </el-button>

          <el-button type="primary" size="mini" icon="el-icon-info" v-on:click="grantAuth(scope.row)">授权
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
  import UserApi from '@/api/user'

  export default {
    data() {
      return {
        condition: {
          page: 1,
          size: 20
        },
        pageData: {
          totalElements: 0
        },
        usersLoading: false
      }
    },
    filters: {
    },
    created() {
      this.fetchUsers();
    },
    methods: {
      fetchUsers() {
        this.usersLoading = true;
        UserApi.findManage(this.condition).then(response => {
          this.pageData = response.data;
          this.usersLoading = false;
        })
      },
      lock(user) {
          this.$confirm('确定要启用用户' + user.name + "吗?", user.name, {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              UserApi.lock(user.id).then(response => {
                  this.$message({
                      message: response.msg,
                      type: 'success'
                  });
                  this.fetchUsers();
              });
          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消操作'
              });
          });
      },
      unlock(user) {
          this.$confirm('确定要禁用用户' + user.name + "吗?", user.name, {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              UserApi.unlock(user.id).then(response => {
                  this.$message({
                      message: response.msg,
                      type: 'success'
                  });
                  this.fetchUsers();
              });
          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消操作'
              });
          });
      },
      grantAuth(user) {

      },
      handleSizeChange(size) {
        this.condition.size = size;
        this.fetchUsers();
      },
      handleCurrentChange(page) {
        this.condition.page = page;
        this.fetchUsers();
      }
    }
  }
</script>
