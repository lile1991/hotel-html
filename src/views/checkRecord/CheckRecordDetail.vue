<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4">房间类型</el-col>
      <el-col :span="6">{{checkInRecord.room.roomType.name}}</el-col>

      <el-col :span="4">房号</el-col>
      <el-col :span="6">{{checkInRecord.room.alias}}</el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4">应付房费</el-col>
      <el-col :span="6">{{checkInRecord.room.charge | amount}}</el-col>

      <el-col :span="4">实付房费</el-col>
      <el-col :span="6">{{checkInRecord.payedCharge | amount}}</el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4">应付押金</el-col>
      <el-col :span="6">{{checkInRecord.room.deposit | amount}}</el-col>

      <el-col :span="4">实付押金</el-col>
      <el-col :span="6">{{checkInRecord.payedDeposit | amount}}</el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="4">入住日期</el-col>
      <el-col :span="12">
        {{checkInRecord.checkInTime | dateFormat}} - {{checkInRecord.overTime | dateFormat}}
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import CheckInRecordApi from '@/api/checkInRecord'

  export default {
    data() {
      return {
        checkInRecord: {
          room: {},
          checkOutRecord: {}
        }
      };
    },
    created() {
      let checkInRecordId = parseInt(this.$route.params["checkInRecordId"]);
      this.loadCheckInRecord(checkInRecordId);
    },
    methods: {
      loadCheckInRecord(id) {
        CheckInRecordApi.findDetail(id).then(response => {
          this.checkInRecord = response.data;
        });
      }
    }
  }
</script>
