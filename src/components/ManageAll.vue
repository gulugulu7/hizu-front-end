<template>
  <div class="user_content">
    <div class="user_content_title">
      <p class="no_select_title">房源管理</p>
      <p class="select_title">全部信息</p>
    </div>
    <div class="no_user_msg" v-if="userHouseLen==0">
      <div class="no_msg_img"></div>
      <div class="no_msg_text">暂无数据~</div>
    </div>
    <div v-else>
      <div class="info_table">
        <p>显示中的信息</p>
        <el-table :data="userHouseListDisplay" border>
          <el-table-column prop="house_number" width="180" label="房屋编号"></el-table-column>
          <el-table-column prop="rental_mode" width="160" label="出租方式"></el-table-column>
          <el-table-column prop="community_name" width="160" label="小区名称"></el-table-column>
          <el-table-column prop="price" label="租金" width="160"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleCheck(scope.$index, scope.row)">查看</el-button>
              <el-button size="mini" type="info" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="info_table">
        <p>审核中的信息</p>
        <el-table :data="userHouseListAudit" border style="width: 100%">
          <el-table-column prop="house_number" width="180" label="房屋编号"></el-table-column>
          <el-table-column prop="rental_mode" width="160" label="出租方式"></el-table-column>
          <el-table-column prop="community_name" width="160" label="小区名称"></el-table-column>
          <el-table-column prop="price" label="租金" width="160"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleCheck(scope.$index, scope.row)">查看</el-button>
              <el-button size="mini" type="info" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="info_table">
        <p>审核失败的信息</p>
        <el-table :data="userHouseListAuditFailed" border style="width: 100%">
          <el-table-column prop="house_number" width="180" label="房屋编号"></el-table-column>
          <el-table-column prop="rental_mode" width="130" label="出租方式"></el-table-column>
          <el-table-column prop="community_name" width="160" label="小区名称"></el-table-column>
          <el-table-column prop="price" label="租金" width="130"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleSubmit(scope.$index, scope.row)">提交</el-button>
              <el-button size="mini" type="info" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              <el-button size="mini" type="success" @click="handleReason(scope.$index, scope.row)">理由</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="info_table">
        <p>已删除的信息</p>
        <el-table :data="userHouseListDeleted" border style="margin-bottom:0.5rem">
          <el-table-column prop="house_number" width="180" label="房屋编号"></el-table-column>
          <el-table-column prop="rental_mode" width="160" label="出租方式"></el-table-column>
          <el-table-column prop="community_name" width="160" label="小区名称"></el-table-column>
          <el-table-column prop="price" label="租金" width="160"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleCheck(scope.$index, scope.row)">查看</el-button>
              <el-button size="mini" type="info" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="success"
                @click="handleRecovery(scope.$index, scope.row)"
              >恢复</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userHouseList: new Array(),
      userHouseLen: "",
      userHouseListDisplay: new Array(),
      userHouseListAudit: new Array(),
      userHouseListAuditFailed: new Array(),
      userHouseListDeleted: new Array(),
      reason:""
    };
  },
  methods: {
    getUserHouse() {
      this.$http.get("api/users/getUserHouse").then(response => {
        this.userHouseList = response.data.userHouseList;
        this.userHouseLen = response.data.userHouseList.length;
        for (var i = 0; i < this.userHouseLen; i++) {
          if (this.userHouseList[i].house_state == 1) {
            this.userHouseListDisplay.push(this.userHouseList[i]);
          } else if (this.userHouseList[i].house_state == 2) {
            this.userHouseListAudit.push(this.userHouseList[i]);
          } else if (this.userHouseList[i].house_state == 3) {
            this.userHouseListAuditFailed.push(this.userHouseList[i]);
          } else if (this.userHouseList[i].house_state == 4) {
            this.userHouseListDeleted.push(this.userHouseList[i]);
          }
        }
      });
    },
    handleCheck(index, row) {
      this.$router.push({ name: "ViewHouse", params: { houseid: row._id } });
    },
    handleEdit(index, row) {
      this.$router.push({ name: "EditHouse", params: { houseid: row._id } });
    },
    handleDelete(index, row) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .get("api/users/deleteUserHouse", {
              params: {
                houseId: row._id
              }
            })
            .then(response => {
              if (response.data.success == "true") {
                this.$message.success("删除成功");
                this.userHouseListDisplay = [];
                this.userHouseListAudit = [];
                this.userHouseListAuditFailed = [];
                this.userHouseListDeleted = [];
                this.getUserHouse();
              } else {
                this.$message.warning("删除失败");
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleRecovery(index, row) {
      this.$confirm("是否恢复?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .get("api/users/recoveryUserHouse", {
              params: {
                houseId: row._id
              }
            })
            .then(response => {
              if (response.data.success == "true") {
                this.$message.success("恢复成功");
                this.userHouseListDisplay = [];
                this.userHouseListAudit = [];
                this.userHouseListAuditFailed = [];
                this.userHouseListDeleted = [];
                this.getUserHouse();
              } else {
                this.$message.warning("恢复失败");
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消恢复"
          });
        });
    },
    handleReason(index, row){
      this.$http.get('api/houses/checkFailedReason',{
        params:{
          houseId:row._id
        }
      }).then(response=>{       
        this.reason=response.data.reason
        this.$alert(response.data.reason.reason, '不通过理由', {
          confirmButtonText: '去修改',
          callback: action => {
            this.$router.push({name:'EditHouse',params:{houseid:response.data.reason.house_id}})
          }
        });
      })
    },
    handleSubmit(index, row){
      this.$http.get('api/houses/resubmission',{
        params:{
          houseId:row._id
        }
      }).then(response=>{
        if(response.data.success=='true'){
          this.$message.success('提交成功')
          this.getUserHouse();
        }
      })
    }
  },
  mounted() {
    this.getUserHouse();
  }
};
</script>

<style scoped>
.info_table > p {
  padding: 0.4rem 0.3rem;
  color: #fdac5b;
  font-weight: bold;
}
</style>

<style>
.info_table .el-table {
  width: 96% !important;
  margin: 0 auto;
}
</style>