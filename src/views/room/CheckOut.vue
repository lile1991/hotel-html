<template>
  <div>
    <el-form :model="checkInVo" :rules="checkInRules" ref="checknOutForm" label-width="100px">
      <el-form-item label="房间类型" prop="roomTypeId" required>
      </el-form-item>
      <el-form-item label="入住房间" prop="roomId" required>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="应付房费">
            <el-input v-model.number="selectedRoom.charge" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实付房费" prop="payedCharge" required>
            <el-input v-model.number="checkInVo.payedCharge"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="应付押金">
            <el-input v-model.number="selectedRoom.deposit" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实付押金" prop="payedDeposit" required>
            <el-input v-model.number="checkInVo.payedDeposit"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="入住日期" required>
        xx-xx
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
  import CheckRecordApi from '@/api/checkRecord'

  export default {
    data() {
      return {
        selectedRoom: {
          deposit: null,
          charge: null
        },
        roomTypes: [],
        rooms: [],
        checkInTimeRanges: [null, null],
        checkOutVo: {
          roomTypeId: null,
          roomId: null,
          payedCharge: null,
          payedDeposit: null
        },
        checkInCustomerList: [{}],
        checkInRules: {
          roomTypeId: [
            {required: true, message: '请选择房间类型', trigger: 'blur'}
          ],
          roomId: [
            {required: true, message: '请选择入住房间', trigger: 'blur'}
          ],
          payedCharge: [
            {required: true, message: '请输入实付房费', trigger: 'blur'},
            {type: "number", message: '实付房费必须为数字', trigger: 'blur'}
          ],
          payedDeposit: [
            {required: true, message: '请输入实付押金', trigger: 'blur'},
            {type: "number", message: '实付押金必须为数字', trigger: 'blur'}
          ],
          checkInTimeRanges: [
            {type: 'array', required: true, message: '请选择入住日期', trigger: 'change'}
          ]
        }
      };
    },
    created() {
      this.loadRoomTypes();
    },
    methods: {
      submitForm(formName) {
        let checkInVo = this.checkInVo;
        checkInVo.checkInTime = this.checkInTimeRanges[0];
        checkInVo.checkOutTime = this.checkInTimeRanges[1];
        checkInVo.checkInCustomerList = this.checkInCustomerList;
        this.$refs[formName].validate((valid) => {
          console.log(valid);
          if (valid) {
            CheckRecordApi.checkIn(checkInVo).then(response => {
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
      loadRooms() {
        if (this.checkInVo.roomTypeId) {
          RoomApi.findAll({roomType: {id: this.checkInVo.roomTypeId}}).then(response => {
            this.rooms = response.data;
          });
        }
      },
      loadRoomTypes() {
        RoomTypeApi.findAll().then(response => {
          this.roomTypes = response.data;
        });
      },
      changeRoom() {
        let selectedRoomId = this.checkInVo.roomId;
        for (let room of this.rooms) {
          if (room.id === selectedRoomId) {
            this.selectedRoom = room;
            break
          }
        }
      },
      addCheckInCustomer() {
        this.checkInCustomerList.push({});
      },
      removeCheckInCustomer(index) {
        this.checkInCustomerList.splice(index, 1);
      }
    }
  }
</script>
