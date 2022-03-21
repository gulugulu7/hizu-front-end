<template>
  <div class="user_content">
    <div class="user_content_title">
      <p class="no_select_title">房源管理</p>
      <p class="select_title">审核中的信息</p>
    </div>
    <div class="no_user_msg" v-if="userHouseLenAudit==0">
      <div class="no_msg_img"></div>
      <div class="no_msg_text">暂无数据~</div>
    </div>
    <div v-else>
      <div class="info_table margin_top">
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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userHouseListAudit: new Array(),
      userHouseLenAudit: ""
    };
  },
  methods: {
    getUserHouseAudit() {
      this.$http
        .get("api/users/getUserHouse", {
          params: { houseState: 2 }
        })
        .then(response => {
          this.userHouseListAudit = response.data.userHouseList;
          this.userHouseLenAudit = response.data.userHouseList.length;
        });
    },
    handleCheck(index, row) {
      this.$router.push({ name: "ViewHouse", params: { houseid: row._id } });
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
                this.getUserHouseAudit();
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
     handleEdit(index, row) {
      this.$router.push({ name: "EditHouse", params: { houseid: row._id } });
    },
  },
  mounted() {
    this.getUserHouseAudit();
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