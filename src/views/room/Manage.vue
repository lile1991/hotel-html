<template>
  <div class="room-container">
    <el-tabs :tab-position="tabPosition" v-loading="loadingRooms" @tab-click="fetchRoomManage">
      <el-tab-pane :label="roomType.name" v-for="roomType in roomTypes">
        <el-row :gutter="20">
          <el-col :span="4" v-for="room in rooms">
            <el-card :body-style="{ padding: '0px' }" class="room-card">
              <img src="http://element-cn.eleme.io/static/hamburger.50e4091.png" class="image">
              <div>
                {{room.alias}}
              </div>
              <el-button-group class="room-card-option">
                <el-button type="primary" size="mini" icon="el-icon-search" v-if="room.state === 'EMPTY'" v-on:click="checkIn(room)">入住</el-button>
                <!--<el-button type="primary" size="mini" icon="el-icon-search" v-if="room.state === 'CHECK_IN'" v-on:click="checkOut(room)">退房</el-button>-->
                <el-button type="primary" size="mini" icon="el-icon-search" v-if="room.state !== 'STOP'" v-on:click="reserve(room)">预定</el-button>
                <el-button type="primary" size="mini" icon="el-icon-search" v-if="room.state === 'EMPTY'" v-on:click="disable(room)">停用</el-button>
                <el-button type="primary" size="mini" icon="el-icon-search" v-if="room.state === 'STOP'" v-on:click="enable(room)">启用</el-button>
                <el-button type="primary" size="mini" icon="el-icon-search" v-if="room.state === 'RESERVE'" v-on:click="cancelReserve(room)">取消预定</el-button>
              </el-button-group>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import RoomTypeApi from '@/api/roomType'
  import RoomApi from '@/api/room'

  export default {
    name: 'RoomManage',
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
    },
    data() {
      return {
        curTabIndex: 0,
        tabPosition: "left",
        roomTypes: null,
        rooms: null,
        loadingRooms: false
      }
    },
    created() {
      this.fetchRoomType();
    },
    methods: {
      checkIn(room) {
        this.$router.push({ path: '/checkRecord/checkIn/' + room.roomType.id + "/" + room.id})
      },
      checkOut(room) {
        // this.$router.push({ path: '/room/checkOut/' + checkRecordId})
      },
      reserve(room) {
        this.$router.push({ path: '/checkRecord/checkIn/' + room.roomType.id + "/" + room.id})
      },
      cancelReserve(room) {
        alert("开发中")
      },
      disable(room) {
        this.$confirm('确定要停用房间' + room.alias + "吗?", room.alias, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          RoomApi.disable(room.id).then(response => {
            this.fetchRoomManage();
            this.$message({
              type: 'success',
              message: response.msg
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      enable(room) {
        this.$confirm('确定要启用房间' + room.alias + "吗?", room.alias, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          RoomApi.enable(room.id).then(response => {
            this.fetchRoomManage();
            this.$message({
              type: 'success',
              message: response.msg
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      fetchRoomType() {
        RoomTypeApi.findAll().then(response => {
          this.roomTypes = response.data;
          if(this.roomTypes && this.roomTypes.length > 0) {
            this.fetchRoomManage();
          }
        });
      },
      fetchRoomManage(tab) {
        if(tab) {
          this.curTabIndex = tab.index;
        }
        let roomType = this.roomTypes[this.curTabIndex];
        this.loadingRooms = true;
        RoomApi.findManage({roomType: {id: roomType.id}}).then(response => {
          this.rooms = response.data;
          this.loadingRooms = false;
        });
      }
    }
  }

</script>

<style type="text/css">
  .room-container .room-card {
    /*background-image: url('http://element-cn.eleme.io/static/hamburger.50e4091.png');*/
    padding: 5px;
  }

  .room-card-option button {
    padding: 3px;
  }
</style>
