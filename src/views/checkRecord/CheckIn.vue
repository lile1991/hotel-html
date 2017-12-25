<template>
  <div>
    <el-form :model="checkInVo" :rules="checkInRules" ref="checkInForm" label-width="100px">
      <el-form-item label="房间类型" prop="roomTypeId" required>
        <el-select v-model.number="checkInVo.roomTypeId" placeholder="请选择" v-on:change="loadRooms">
          <el-option v-for="roomType in roomTypes" :key="roomType.id" :value="roomType.id" :label="roomType.name"/>
        </el-select>
      </el-form-item>

      <el-form-item label="入住房间" prop="roomId" required>
        <el-select v-model.number="checkInVo.roomId" placeholder="请选择" v-on:change="changeRoom">
          <el-option v-for="room in rooms" :key="room.id" :value="room.id" :label="room.alias"/>
        </el-select>
      </el-form-item>

      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item label="应付房费">
            {{selectedRoom.charge | amount}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="实付房费" prop="payedCharge" required>
            <el-input v-model.number="checkInVo.payedCharge"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item label="应付押金">
            {{selectedRoom.deposit | amount}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="实付押金" prop="payedDeposit" required>
            <el-input v-model.number="checkInVo.payedDeposit"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="入住日期" required>
            <el-date-picker
              v-model="checkInTimeRanges"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-for="(checkInCustomer, index) in checkInCustomers">
        <el-col :span="6">
          <el-form-item label="客户姓名" required>
            <el-input v-model="checkInCustomer.name" :rules="[{ required: true, message: '请填写客户姓名'}]"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="身份证号" required>
            <el-input v-model="checkInCustomer.idCard" :rules="[{ required: true, message: '请填写客户身份证号'}]"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号">
            <el-input v-model="checkInCustomer.mobile"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" v-on:click="addCheckInCustomer"
                     v-if="index === checkInCustomers.length - 1">添加入住人员
          </el-button>
          <el-button type="danger" v-on:click="removeCheckInCustomer(index)" v-else>删除</el-button>
        </el-col>
      </el-row>


      <el-form-item>
        <el-button type="primary" @click="submitForm('checkInForm')">登记</el-button>
        <el-button @click="resetForm('checkInForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import RoomApi from '@/api/room'
  import RoomTypeApi from '@/api/roomType'
  import CheckInRecordApi from '@/api/checkInRecord'

  export default {
    data() {
      return {
        isSelectedRoom: false,
        selectedRoom: {
          deposit: null,
          charge: null
        },
        roomTypes: [],
        rooms: [],
        checkInTimeRanges: [null, null],
        checkInVo: {
          roomTypeId: null,
          roomId: null,
          payedCharge: null,
          payedDeposit: null
        },
        checkInCustomers: [{}],
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
    beforeRouteEnter(to, from, next) {
      let roomId = to.params["roomId"];
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.isSelectedRoom = Boolean(roomId);
      });
    },
    created() {
      let roomTypeId = parseInt(this.$route.params["roomTypeId"]);
      let roomId = parseInt(this.$route.params["roomId"]);

      let checkInVo = this.checkInVo;

      this.loadRoomTypes().then(data => {
        if (roomTypeId) {
          checkInVo.roomTypeId = roomTypeId;

          this.loadRooms().then(data => {
            if (roomId) {
              checkInVo.roomId = roomId;
              this.changeRoom();
            }
          });
        }
      });
    },
    methods: {
      submitForm(formName) {
        let checkInVo = this.checkInVo;
        checkInVo.checkInTime = this.checkInTimeRanges[0];
        checkInVo.overTime = this.checkInTimeRanges[1];
        checkInVo.checkInCustomers = this.checkInCustomers;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            CheckInRecordApi.checkIn(checkInVo).then(response => {
              this.$message({
                message: response.msg,
                type: 'success'
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
      // 加载房间类型列表
      loadRoomTypes() {
        return new Promise(resolve => {
          RoomTypeApi.findAll().then(response => {
            this.roomTypes = response.data;
            resolve(response);
          });
        });
      },
      // 加载房间列表
      loadRooms() {
        return new Promise(resolve => {
          if (this.checkInVo.roomTypeId) {
            RoomApi.findAll({roomType: {id: this.checkInVo.roomTypeId}}).then(response => {
              this.rooms = response.data;
              this.checkInVo.roomId = null;
              resolve(response);
            });
          }
        })
      },
      // 改变房间
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
        this.checkInCustomers.push({});
      },
      removeCheckInCustomer(index) {
        this.checkInCustomers.splice(index, 1);
      }
    }
  }
</script>
