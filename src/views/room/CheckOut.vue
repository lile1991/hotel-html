<template>
  <div>
    <el-form :model="checkOutVo" :rules="checkOutRules" ref="checknOutForm" label-width="100px">
      <el-form-item label="房间">
        {{checkInRecord.room.alias}}
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="实付房费">
            {{checkInRecord.payedCharge}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="实付押金">
            {{checkInRecord.payedDeposit}}
          </el-form-item>

          <el-form-item label="扣除押金" required>
            <el-input v-model.number="checkOutVo.deductDeposit"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="入住日期" required>
        {{checkOutVo.checkInTime | dateFormat}} - {{checkOutVo.checkOutTime | dateFormat}}
      </el-form-item>

      <el-form-item label="备注" required>
        <el-input
          type="textarea"
          :rows="5"
          placeholder="备注内容"
          v-model="checkOutVo.remark">
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('checknOutForm')">退房/取消预定</el-button>
        <el-button @click="resetForm('checknOutForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import RoomApi from '@/api/room'
  import RoomTypeApi from '@/api/roomType'
  import CheckOutRecordApi from '@/api/checkOutRecord'

  export default {
    data() {
      return {
        rooms: [],
        checkInRecord: {
          room: {}
        },
        checkOutVo: {
          roomTypeId: null,
          roomId: null,
          deductDeposit: 0
        },
        checkOutRules: {
          checkInTimeRanges: [
            {type: 'array', required: true, message: '请选择入住日期', trigger: 'change'}
          ]
        }
      };
    },
    created() {
      this.loadcheckInRecord(this.$route.params.id);
    },
    methods: {
      submitForm(formName) {
        let checkOutVo = this.checkOutVo;
        checkOutVo.checkInTime = this.checkInTimeRanges[0];
        checkOutVo.checkOutTime = this.checkInTimeRanges[1];
        checkOutVo.checkInCustomerList = this.checkInCustomerList;
        this.$refs[formName].validate((valid) => {
          console.log(valid);
          if (valid) {
            CheckOutRecordApi.checkOut(checkOutVo).then(response => {
              this.$message({
                type: 'success',
                message: response
              }.msg);
              this.$router.push({ path: '/room/manage'})
            });
          } else {
            this.$message.error("信息录入有误");
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      loadcheckInRecord(id) {
        CheckOutRecordApi.findOne(id).then(response => {
          this.checkInRecord = response.data;
        });
      }
    }
  }
</script>
