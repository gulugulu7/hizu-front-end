<template>
  <div class="user_content">
    <div class="user_content_title">
      <p class="no_select_title">房源管理</p>
      <p class="select_title">已删除的信息</p>
    </div>
    <div class="no_user_msg" v-if="userHouseLenDelited==0">
      <div class="no_msg_img"></div>
      <div class="no_msg_text">暂无数据~</div>
    </div>
    <div v-else>
      <div class="info_table margin_top">
        <el-table :data="userHouseListDelited" border style="width: 100%">
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
      userHouseListDelited: new Array(),
      userHouseLenDelited: ""
    };
  },
  methods: {
    getUserHouseDelited() {
      this.$http
        .get("api/users/getUserHouse", {
          params: { houseState: 4 }
        })
        .then(response => {
          this.userHouseListDelited = response.data.userHouseList;
          this.userHouseLenDelited = response.data.userHouseList.length;
        });
    },
    handleCheck(index, row) {
      this.$router.push({ name: "ViewHouse", params: { houseid: row._id } });
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
                this.getUserHouseDelited();
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
    handleEdit(index, row) {
      this.$router.push({ name: "EditHouse", params: { houseid: row._id } });
    }
  },
  mounted() {
    this.getUserHouseDelited();
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