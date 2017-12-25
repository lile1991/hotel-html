<template>
  <div>
    <el-form :model="checkOutVo" :rules="checkOutRules" ref="checkOutForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="房间">
            {{checkInRecord.room.alias}} ({{checkInRecord.room.roomType.name}})
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="应付房费">
            {{checkInRecord.room.charge | amount}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="实付房费">
            {{checkInRecord.payedCharge | amount}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="应付押金">
            {{checkInRecord.room.deposit | amount}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="实付押金">
            {{checkInRecord.payedDeposit | amount}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="入住日期" required>
        {{checkInRecord.checkInTime | dateFormat}} - {{checkInRecord.overTime | dateFormat}}
      </el-form-item>

      <el-row>
        <el-col :span="6">
          <el-form-item label="扣除押金" required>
            <el-input v-model.number="checkOutVo.deductDeposit"></el-input>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
        <el-col :span="12">
          <el-form-item label="备注" required>
            <el-input
              type="textarea"
              :rows="5"
              placeholder="备注内容"
              v-model="checkOutVo.remark">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" @click="submitForm('checkOutForm')">退房/取消预定</el-button>
        <el-button @click="resetForm('checkOutForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import RoomApi from '@/api/room'
  import RoomTypeApi from '@/api/roomType'
  import CheckInRecordApi from '@/api/checkInRecord'
  import CheckOutRecordApi from '@/api/checkOutRecord'

  export default {
    data() {
      return {
        checkInRecord: {
          room: {
            roomType: {}
          }
        },
        checkOutVo: {
          backDeposit: 0,
          deductDeposit: 0,
          remark: ""
        },
        checkOutRules: {
          deductDeposit: [
            {type: 'number', required: true, message: '请输入扣除押金', trigger: 'blur'}
          ]
        }
      };
    },
    created() {
      this.loadCheckInRecord(this.$route.params.checkInRecordId);
    },
    methods: {
      submitForm(formName) {
        let checkOutVo = this.checkOutVo;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            CheckOutRecordApi.checkOut(checkOutVo).then(response => {
              this.$message({
                type: 'success',
                message: response.msg
              });
              this.$router.push({path: '/room/manage'})
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
      loadCheckInRecord(id) {
        CheckInRecordApi.findFromCheckOut(id).then(response => {
          this.checkInRecord = response.data;
          this.checkOutVo.checkInId = this.checkInRecord.id;
        });
      }
    }
  }
</script>
