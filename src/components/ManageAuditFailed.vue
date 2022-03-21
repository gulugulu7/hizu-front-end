<template>
  <div class="user_content">
    <div class="user_content_title">
      <p class="no_select_title">房源管理</p>
      <p class="select_title">审核未通过的信息</p>
    </div>
    <div class="no_user_msg" v-if="userHouseLenAuditFailed==0">
      <div class="no_msg_img"></div>
      <div class="no_msg_text">暂无数据~</div>
    </div>
    <div v-else>
      <div class="info_table margin_top">
        <el-table :data="userHouseListAuditFailed" border style="width: 100%">
          <el-table-column prop="house_number" width="180" label="房屋编号"></el-table-column>
          <el-table-column prop="rental_mode" width="120" label="出租方式"></el-table-column>
          <el-table-column prop="community_name" width="160" label="小区名称"></el-table-column>
          <el-table-column prop="price" label="租金" width="120"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
               <el-button size="mini" type="primary" @click="handleSubmit(scope.$index, scope.row)">提交</el-button>
              <el-button size="mini" type="info" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              <el-button
                size="mini"
                type="success"
                @click="handleReason(scope.$index, scope.row)"
              >理由</el-button>
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
      userHouseListAuditFailed: new Array(),
      userHouseLenAuditFailed: ""
    };
  },
  methods: {
    getUserHouseAuditFailed() {
      this.$http
        .get("api/users/getUserHouse", {
          params: { houseState: 3 }
        })
        .then(response => {
          this.userHouseListAuditFailed = response.data.userHouseList;
          this.userHouseLenAuditFailed = response.data.userHouseList.length;
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
                this.getUserHouseAuditFailed();
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
    handleReason(index, row) {
      this.$http
        .get("api/houses/checkFailedReason", {
          params: {
            houseId: row._id
          }
        })
        .then(response => {
          this.reason = response.data.reason;
          this.$alert(response.data.reason.reason, "不通过理由", {
            confirmButtonText: "去修改",
            callback: action => {
              this.$router.push({
                name: "EditHouse",
                params: { houseid: response.data.reason.house_id }
              });
            }
          });
        });
    },
     handleSubmit(index, row){
      this.$http.get('api/houses/resubmission',{
        params:{
          houseId:row._id
        }
      }).then(response=>{
        if(response.data.success=='true'){
          this.$message.success('提交成功')
           this.getUserHouseAuditFailed();
        }
      })
    }
  },
  mounted() {
    this.getUserHouseAuditFailed();
  }
};
</script>

<style>
.info_table .el-table {
  width: 96% !important;
  margin: 0 auto;
}
.margin_top .el-table {
  margin-top: 0.3rem !important;
}
</style>