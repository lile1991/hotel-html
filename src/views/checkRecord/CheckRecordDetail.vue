<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          <B>{{checkInRecord.room.alias}} - {{checkInRecord.room.roomType.name}}</B>
          <el-tag type="success" v-if="checkInRecord.state === 'CHECK_IN'">已入住</el-tag>
          <el-tag type="danger" v-if="checkInRecord.state === 'LEFT'">已退房</el-tag>
          <el-tag v-if="checkInRecord.state === 'RESERVE'">预定</el-tag>
          <el-tag type="warning" v-if="checkInRecord.state === 'CANCELED_RESERVE'">已取消预定</el-tag>
        </span>
        <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
      </div>
      <div>
        <el-collapse v-model="activeNames" id="ht-collapse-detail">
          <el-collapse-item title="房间信息" name="1">
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="el-form-item__label">定价</label>
                <div class="el-form-item__content">{{checkInRecord.room.charge | amount}}</div>
              </el-col>
              <el-col :span="6">
                <label class="el-form-item__label">押金</label>
                <div class="el-form-item__content">{{checkInRecord.room.deposit | amount}}</div>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="登记信息" name="2">
            <el-row :gutter="20">
              <el-col :span="12">
                <label class="el-form-item__label">入住日期</label>
                <div class="el-form-item__content">{{checkInRecord.checkInTime | dateFormat}} - {{checkInRecord.overTime | dateFormat}}
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <label class="el-form-item__label">预留手机号</label>
                <div class="el-form-item__content"> {{checkInRecord.mobile}}</div>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="6">
                <label class="el-form-item__label">登记日期</label>
                <div class="el-form-item__content">{{checkInRecord.createTime | dateFormat}}</div>
              </el-col>
              <el-col :span="6">
                <label class="el-form-item__label">登记人</label>
                <div class="el-form-item__content">{{checkInRecord.createUser.name}}</div>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="登记客户" name="3">
            <el-row :gutter="20" v-for="checkInCustomer in checkInRecord.checkInCustomers">
              <el-col :span="6">
                <label class="el-form-item__label">客户姓名</label>
                <div class="el-form-item__content">{{checkInCustomer.name}}</div>
              </el-col>
              <el-col :span="6">
                <label class="el-form-item__label">身份证号</label>
                <div class="el-form-item__content">{{checkInCustomer.idCard}}</div>
              </el-col>
              <el-col :span="6">
                <label class="el-form-item__label">手机号</label>
                <div class="el-form-item__content">{{checkInCustomer.mobile}}</div>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="支付信息" name="4">
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="el-form-item__label">实付房费</label>
                <div class="el-form-item__content">{{checkInRecord.payedCharge | amount}}</div>
              </el-col>
              <el-col :span="6">
                <label class="el-form-item__label">实付押金</label>
                <div class="el-form-item__content"> {{checkInRecord.payedDeposit | amount}}</div>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="离店" name="5" v-if="checkInRecord.checkOutRecord.id">
            <el-row :gutter="20">
              <el-col :span="6">
                <label class="el-form-item__label">离店日期</label>
                <div class="el-form-item__content">{{checkInRecord.checkOutRecord.checkOutTime | dateFormat}}</div>
              </el-col>
              <el-col :span="6">
                <label class="el-form-item__label">扣除押金</label>
                <div class="el-form-item__content">{{checkInRecord.checkOutRecord.deductDeposit | amount}}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="20">
                <label class="el-form-item__label">备注</label>
                <div class="el-form-item__content">{{checkInRecord.checkOutRecord.remark}}</div>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import CheckInRecordApi from '@/api/checkInRecord'
  import ElCollapseItem from "element-ui/packages/collapse/src/collapse-item";

  export default {
    components: {ElCollapseItem},
    data() {
      return {
        activeNames: ['1', '2', '3', '4', '5'],
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
<style type="text/css">
  #ht-collapse-detail .el-collapse-item__header {
    font-family: "Hiragino Sans GB";
    font-size: larger;
  }
</style>
